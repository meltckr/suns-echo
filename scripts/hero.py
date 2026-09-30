"""Rebuild the cinematic Media Day package: blender -b -P scripts/hero.py.
Packed official group photograph, feathered depth bands; no generated people. EEVEE at 24 fps.
The closed camera/light path includes an unrendered identical endpoint.
"""
import argparse, hashlib, json, math, shutil, subprocess, sys, tempfile
from pathlib import Path
from datetime import datetime, timezone
import bpy
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/assets/media'; BLENDS=ROOT/'assets/blender'
PREFIX='media-day-2026-09-28'; TITLE='In the Same Building'; FPS=24
GROUP=OUT/'source/suns-media-day-2026-09-28-group.jpg'

def material(name,color=(.05,.015,.12,1),photo=None,metallic=0):
    m=bpy.data.materials.new(name); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=color
    p.inputs['Metallic'].default_value=metallic; p.inputs['Roughness'].default_value=.34
    if photo:
        image=bpy.data.images.load(str(photo),check_existing=True); image.pack()
        t=m.node_tree.nodes.new('ShaderNodeTexImage'); t.image=image
        m.node_tree.links.new(t.outputs['Color'],p.inputs['Base Color'])
        m.node_tree.links.new(t.outputs['Color'],p.inputs['Emission Color'])
        p.inputs['Emission Strength'].default_value=.68
    return m

def photographic_layer(name, low, high):
    """Feathered UV bands preserve the official portrait across three real depths."""
    m=material(name,photo=GROUP); n=m.node_tree.nodes; links=m.node_tree.links
    p=n.get('Principled BSDF'); p.inputs['Emission Strength'].default_value=.62
    p.inputs['Roughness'].default_value=1; p.inputs['Specular IOR Level'].default_value=0
    uv=n.new('ShaderNodeTexCoord'); xy=n.new('ShaderNodeSeparateXYZ'); links.new(uv.outputs['UV'],xy.inputs[0])
    def op(kind,a,b):
        q=n.new('ShaderNodeMath'); q.operation=kind
        for i,v in enumerate((a,b)):
            if isinstance(v,(float,int)): q.inputs[i].default_value=v
            else: links.new(v,q.inputs[i])
        return q.outputs[0]
    x=xy.outputs['X']; y=xy.outputs['Y']
    edge=op('MINIMUM',op('MINIMUM',x,op('SUBTRACT',1,x)),op('MINIMUM',y,op('SUBTRACT',1,y)))
    feather=n.new('ShaderNodeMapRange'); feather.interpolation_type='SMOOTHERSTEP'; feather.clamp=True
    feather.inputs['From Min'].default_value=0; feather.inputs['From Max'].default_value=.13
    links.new(edge,feather.inputs['Value'])
    dx=op('SUBTRACT',x,.5); dy=op('SUBTRACT',y,.5)
    radius=op('ADD',op('MULTIPLY',dx,dx),op('MULTIPLY',dy,dy))
    oval=n.new('ShaderNodeMapRange'); oval.interpolation_type='SMOOTHERSTEP'; oval.clamp=True
    oval.inputs['From Min'].default_value=.19; oval.inputs['From Max'].default_value=.43
    oval.inputs['To Min'].default_value=1; oval.inputs['To Max'].default_value=0
    links.new(radius,oval.inputs['Value'])
    band=op('MULTIPLY',op('GREATER_THAN',y,low),op('LESS_THAN',y,high))
    links.new(op('MULTIPLY',op('MULTIPLY',feather.outputs['Result'],oval.outputs['Result']),band),p.inputs['Alpha'])
    m.surface_render_method='BLENDED'
    return m

def plane(name,x,y,z,w,h,mat):
    bpy.ops.mesh.primitive_plane_add(size=2,location=(x,y,z))
    o=bpy.context.object; o.name=name; o.scale=(w/2,h/2,1); o.data.materials.append(mat); return o

def text(body,x,y,z,size,mat,name):
    c=bpy.data.curves.new(name,'FONT'); c.body=body; c.size=size; c.extrude=.032; c.bevel_depth=.008; c.bevel_resolution=2
    o=bpy.data.objects.new(name,c); bpy.context.collection.objects.link(o); o.location=(x,y,z); o.data.materials.append(mat); return o

def area(name,location,color,power,size,target):
    d=bpy.data.lights.new(name,'AREA'); d.energy=power; d.color=color; d.use_shadow=False; d.shape='DISK'; d.size=size
    o=bpy.data.objects.new(name,d); bpy.context.collection.objects.link(o); o.location=location
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler(); return o

def setup(width,height,seconds,sting=False):
    bpy.ops.wm.read_factory_settings(use_empty=True); s=bpy.context.scene
    s.render.engine='BLENDER_EEVEE'
    s.render.resolution_x=width; s.render.resolution_y=height; s.render.resolution_percentage=100
    s.render.fps=FPS; s.frame_start=1; s.frame_end=int(seconds*FPS)
    s.render.image_settings.file_format='PNG'; s.render.image_settings.color_mode='RGB'
    s.render.image_settings.compression=15
    s.eevee.taa_render_samples=16
    s.view_settings.view_transform='AgX'
    s.world=bpy.data.worlds.new('Deep black'); s.world.use_nodes=True
    s.world.node_tree.nodes['Background'].inputs[0].default_value=(.003,.001,.009,1)
    s.world.node_tree.nodes['Background'].inputs[1].default_value=.15
    purple=material('Suns purple',(.006,.002,.018,1),metallic=.3)
    orange=material('Suns orange',(1,.19,.015,1),metallic=.5)
    cream=material('Warm white title',(.92,.88,.80,1),metallic=.28)
    portrait=height>width
    plane('Architectural black-purple backdrop',0,0,-1.8,28,30,purple)
    # A single official photograph spans three shallow depth bands. No duplicate people.
    photo_x,photo_y,photo_w=(0,1.35,7.1) if portrait else (2.55,.05,7.5)
    base_z=10.8 if portrait else 18
    for label,low,high,z in [('Back photograph',.90,1.01,-.04),('Mid photograph',.08,.90,0),('Foreground photograph',-.01,.08,.04)]:
        factor=(base_z-z)/base_z
        plane(label,photo_x*factor,photo_y*factor,z,photo_w*factor,photo_w*1.25*factor,photographic_layer(label,low,high))
    if portrait:
        title_x=-2.92; title_y=-3.20; size=.71
    else:
        title_x=-5.12; title_y=.45; size=.77
    lines=['In the Same','Building']
    for i,line in enumerate(lines): text(line,title_x,title_y-i*size*1.18,1.15,size,cream,'Edition title '+str(i))
    text('THE ECHO  /  PHOENIX SUNS',title_x,title_y+size*.9,1.15,.16,orange,'Publication')
    text('MEDIA DAY  /  SEP 28, 2026',title_x,title_y-size*1.95,1.15,.14,cream,'Edition date')
    for obj in bpy.context.scene.objects:
        if obj.type=='FONT': obj.hide_render=not sting
    plane('Foreground orange light rail',-3.2 if portrait else -5.5,0,1.65,.035,18,orange)
    plane('Foreground purple light rail',3.4 if portrait else 5.8,0,1.9,.07,18,purple)
    # A bounded scattering volume gives actual soft lit atmosphere, not an overlay.
    bpy.ops.mesh.primitive_cube_add(size=2,location=(0,0,2.4)); fog=bpy.context.object; fog.name='Soft volumetric atmosphere'; fog.scale=(10,12,.8)
    m=bpy.data.materials.new('Fine atmospheric haze'); m.use_nodes=True; n=m.node_tree.nodes; n.clear()
    v=n.new('ShaderNodeVolumePrincipled'); v.inputs['Density'].default_value=.012; v.inputs['Color'].default_value=(.4,.27,.65,1)
    o=n.new('ShaderNodeOutputMaterial'); m.node_tree.links.new(v.outputs['Volume'],o.inputs['Volume']); fog.data.materials.append(m)
    area('Purple soft key',(-5,3,6),(.43,.12,1),650,7,(0,0,0))
    sweep=area('Orange title light sweep',(-6,1,4),(1,.40,.12),850,3,(title_x+2,title_y,1))
    area('Photo softbox',(4,4,7),(1,.9,.8),180,8,(3,0,0))
    bpy.ops.object.camera_add(location=(0,0,10.8 if portrait else 18)); cam=bpy.context.object; s.camera=cam
    cam.data.lens=50; cam.data.sensor_fit='HORIZONTAL'; cam.data.sensor_width=36
    cam.data.dof.use_dof=True; cam.data.dof.focus_distance=cam.location.z; cam.data.dof.aperture_fstop=3.2
    base=cam.location.z; frames=s.frame_end
    for f in range(1,frames+2):
        phase=2*math.pi*(f-1)/frames; eased=.5-.5*math.cos(phase)
        cam.location=(.06*math.sin(phase),.035*math.sin(phase),base-.24*eased)
        cam.keyframe_insert(data_path='location',frame=f)
        sweep.location.x=-6+12*eased; sweep.keyframe_insert(data_path='location',frame=f)
    s['edition_title']=TITLE; s['photo_ledger']='research/media-day-2026-09-28/photo-ledger.json'
    s['loop']='Closed cosine dolly and light sweep, next unrendered sample equals first'
    s['photo_depths']=[-.04,0,.04]; s['grain']='ffmpeg uniform grain strength 1 after render'
    s.frame_set(1); first=tuple(cam.location); light_first=tuple(sweep.location)
    s.frame_set(frames+1); assert max(abs(a-b) for a,b in zip(first,cam.location))<1e-6
    assert max(abs(a-b) for a,b in zip(light_first,sweep.location))<1e-6
    s.frame_set(1); return s

def run(kind,width,height,seconds,preview=False):
    scene=setup(width,height,seconds,kind!='hero'); orient='landscape' if width>height else 'portrait'
    name=f'{PREFIX}-{width}x{height}-v3' if kind=='hero' else f'{PREFIX}-{kind}-{width}x{height}-v3'
    scene.render.filepath='//../../public/assets/media/render-frames/'
    bpy.context.preferences.filepaths.save_version=0
    bpy.ops.wm.save_as_mainfile(filepath=str(BLENDS/f'{PREFIX}-{kind}-{orient}-v3.blend'))
    with tempfile.TemporaryDirectory(prefix='echo-cinematic-') as cache:
        scene.render.filepath=cache+'/frame-'
        if preview:
            scene.render.filepath='/private/tmp/echo-cinematic-'+orient+'.png'; bpy.ops.render.render(write_still=True); return
        bpy.ops.render.render(animation=True)
        video=OUT/(name+'.mp4')
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate',str(FPS),'-i',cache+'/frame-%04d.png','-vf','noise=alls=1:allf=u','-c:v','libx264','-preset','fast','-crf','22','-maxrate','6500k','-bufsize','6500k','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(video)],check=True)
        assert video.stat().st_size<8_000_000
        poster=OUT/(f'{PREFIX}-'+('poster' if width>height else 'portrait-poster')+'-v3.webp') if kind=='hero' else OUT/(name+'-poster.webp')
        subprocess.run(['node','-e','require("sharp")(process.argv[1]).webp({quality:92}).toFile(process.argv[2])',cache+'/frame-0001.png',str(poster)],cwd=ROOT,check=True)
        if kind=='hero' and width>height:
            scene.frame_set(1)
            for obj in scene.objects:
                if obj.type=='FONT': obj.hide_render=False
            scene.render.filepath=cache+'/hero-title-frame.png'
            bpy.ops.render.render(write_still=True)
            subprocess.run(['node','-e','require("sharp")(process.argv[1]).resize(1200,630,{fit:"contain",background:"#07040c"}).png().toFile(process.argv[2])',cache+'/hero-title-frame.png',str(ROOT/'public/og-media-day-2026-09-28-v3.png')],cwd=ROOT,check=True)
        # Title card and divider share the edition title and cinematic scene.
        if kind=='sting': shutil.copyfile(video,OUT/(name.replace('-sting-','-title-card-')+'.mp4'))
    print('DELIVERED',video,flush=True)

def write_manifest():
    assets=[]
    files=sorted(OUT.glob('*v3.mp4'))+sorted(OUT.glob('*v3.webp'))+sorted(OUT.glob('*v3-poster.webp'))+[ROOT/'public/og-media-day-2026-09-28-v3.png']
    assert len(files)==11, 'Full package requires six MP4s, four posters and one OG'
    for path in files:
        item={'file':str(path.relative_to(ROOT)), 'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
        if path.suffix=='.mp4':
            item['probe']=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))
            stream=item['probe']['streams'][0]
            assert stream['codec_name']=='h264' and stream['pix_fmt']=='yuv420p'
            assert (stream['width'],stream['height']) in [(1920,1080),(1080,1920)]
            assert path.stat().st_size<8_000_000
            assert float(item['probe']['format']['duration'])==(2.5 if ('sting' in path.name or 'title-card' in path.name) else 8)
            item['probedAt']=datetime.now(timezone.utc).isoformat(); item['probedOn']='Studio'
        assets.append(item)
    manifest={'renderer':'Blender 5.2.2 LTS / EEVEE', 'editionTitle':TITLE,
              'cameraLoop':{'seconds':8,'fps':24,'frames':192,'endpoint':'Camera and sweep transforms identical at frames 1 and 193 within 1e-6'},
              'photography':'Packed official Media Day group photograph; see photo-ledger.json',
              'heroTreatment':'Photo-only hero; extruded typography enabled for the same frame-1 OG title pass and divider/title-card clips' ,
              'scene':{'photoPlaneDepths':[-.04,0,.04],'depthOfFieldFstop':3.2,'volumetricDensity':.012,'titleExtrusion':.032,'samples':16},
              'titleCard':'The 2.5-second title card is also the section divider sting; same edition title and light sweep.',
              'savedScenes':[{'file':str(p.relative_to(ROOT)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(BLENDS.glob('*v3.blend'))],
              'assets':assets}
    (ROOT/'research/media-day-2026-09-28/media-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print('VERIFIED',len(assets),'cinematic assets',flush=True)

def main():
    p=argparse.ArgumentParser(); p.add_argument('--manifest-only',action='store_true'); p.add_argument('--preview',action='store_true'); p.add_argument('--orientation',choices=['both','landscape','portrait'],default='both'); p.add_argument('--kind',choices=['both','hero','sting'],default='both')
    a=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
    OUT.mkdir(parents=True,exist_ok=True); BLENDS.mkdir(parents=True,exist_ok=True)
    if a.manifest_only:
        write_manifest(); return
    for kind in ['hero','sting']:
        if a.kind not in ['both',kind]: continue
        for orientation,w,h in [('landscape',1920,1080),('portrait',1080,1920)]:
            if a.orientation in ['both',orientation]: run(kind,w,h,8 if kind=='hero' else 2.5,a.preview)
    if not a.preview and a.kind=='both' and a.orientation=='both': write_manifest()
if __name__=='__main__': main()

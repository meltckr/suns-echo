"""Rebuild the cinematic Media Day package: blender -b -P scripts/hero.py.
Packed, sourced photographic panels; no generated people. EEVEE at 24 fps.
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
BOOKER=OUT/'source/suns-media-day-2026-09-28-booker.jpg'

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

def plane(name,x,y,z,w,h,mat):
    bpy.ops.mesh.primitive_plane_add(size=2,location=(x,y,z))
    o=bpy.context.object; o.name=name; o.scale=(w/2,h/2,1); o.data.materials.append(mat); return o

def text(body,x,y,z,size,mat,name):
    c=bpy.data.curves.new(name,'FONT'); c.body=body; c.size=size; c.extrude=.032; c.bevel_depth=.008; c.bevel_resolution=2
    o=bpy.data.objects.new(name,c); bpy.context.collection.objects.link(o); o.location=(x,y,z); o.data.materials.append(mat); return o

def area(name,location,color,power,size,target):
    d=bpy.data.lights.new(name,'AREA'); d.energy=power; d.color=color; d.shape='DISK'; d.size=size
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
    purple=material('Suns purple',(.035,.005,.13,1),metallic=.3)
    orange=material('Suns orange',(1,.19,.015,1),metallic=.5)
    cream=material('Warm white title',(.92,.88,.80,1),metallic=.28)
    group=material('Official Suns group photograph',photo=GROUP)
    booker=material('Official Suns Booker photograph',photo=BOOKER)
    portrait=height>width
    plane('Architectural black-purple backdrop',0,0,-1.8,28,30,purple)
    if portrait:
        plane('Back photographic plane — Booker',-1.6,2,-.9,3.7,4.63,booker)
        plane('Mid photographic plane — complete group',.45,1.4,0,6.0,7.5,group)
        plane('Foreground photographic plane — Booker',2.85,-3.1,.7,1.3,1.63,booker)
        title_x=-3.05; title_y=-3.65; size=.75
        lines=['In the Same','Building']
        plane('Title matte',0,-4.25,1.0,8,3.3,purple)
    else:
        plane('Back photographic plane — Booker',.5,.0,-.9,3.5,4.38,booker)
        plane('Mid photographic plane — complete group',3.15,.05,0,4.55,5.69,group)
        plane('Foreground photographic plane — Booker',5.4,-2.0,.7,1.15,1.44,booker)
        title_x=-5.15; title_y=.45; size=.82; lines=['In the Same','Building']
        plane('Title matte',-3.0,0,.4,5.4,8,purple)
    for i,line in enumerate(lines): text(line,title_x,title_y-i*size*1.18,1.15,size,cream,'Edition title '+str(i))
    text('THE ECHO  /  PHOENIX SUNS',title_x,title_y+size*.9,1.15,.16,orange,'Publication')
    text('MEDIA DAY  /  SEP 28, 2026',title_x,title_y-size*1.95,1.15,.14,cream,'Edition date')
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
    cam.data.dof.use_dof=True; cam.data.dof.focus_distance=cam.location.z-.7; cam.data.dof.aperture_fstop=3.2
    base=cam.location.z; frames=s.frame_end
    for f in range(1,frames+2):
        phase=2*math.pi*(f-1)/frames; eased=.5-.5*math.cos(phase)
        cam.location=(.06*math.sin(phase),.035*math.sin(phase),base-.24*eased)
        cam.keyframe_insert(data_path='location',frame=f)
        sweep.location.x=-6+12*eased; sweep.keyframe_insert(data_path='location',frame=f)
    s['edition_title']=TITLE; s['photo_ledger']='research/media-day-2026-09-28/photo-ledger.json'
    s['loop']='Closed cosine dolly and light sweep, next unrendered sample equals first'
    s['photo_depths']=[-.9,0,.7]; s['grain']='ffmpeg temporal-uniform grain strength 1 after render'
    s.frame_set(1); first=tuple(cam.location); light_first=tuple(sweep.location)
    s.frame_set(frames+1); assert max(abs(a-b) for a,b in zip(first,cam.location))<1e-6
    assert max(abs(a-b) for a,b in zip(light_first,sweep.location))<1e-6
    s.frame_set(1); return s

def run(kind,width,height,seconds,preview=False):
    scene=setup(width,height,seconds,kind!='hero'); orient='landscape' if width>height else 'portrait'
    name=f'{PREFIX}-{width}x{height}-v2' if kind=='hero' else f'{PREFIX}-{kind}-{width}x{height}-v2'
    scene.render.filepath='//../../public/assets/media/render-frames/'
    bpy.context.preferences.filepaths.save_version=0
    bpy.ops.wm.save_as_mainfile(filepath=str(BLENDS/f'{PREFIX}-{kind}-{orient}-v2.blend'))
    with tempfile.TemporaryDirectory(prefix='echo-cinematic-') as cache:
        scene.render.filepath=cache+'/frame-'
        if preview:
            scene.render.filepath='/private/tmp/echo-cinematic-'+orient+'.png'; bpy.ops.render.render(write_still=True); return
        bpy.ops.render.render(animation=True)
        video=OUT/(name+'.mp4')
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate',str(FPS),'-i',cache+'/frame-%04d.png','-vf','noise=alls=1:allf=u','-c:v','libx264','-preset','fast','-crf','22','-maxrate','6500k','-bufsize','6500k','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(video)],check=True)
        assert video.stat().st_size<8_000_000
        poster=OUT/(f'{PREFIX}-'+('poster' if width>height else 'portrait-poster')+'-v2.webp') if kind=='hero' else OUT/(name+'-poster.webp')
        subprocess.run(['node','-e','require("sharp")(process.argv[1]).webp({quality:92}).toFile(process.argv[2])',cache+'/frame-0001.png',str(poster)],cwd=ROOT,check=True)
        if kind=='hero' and width>height:
            subprocess.run(['node','-e','require("sharp")(process.argv[1]).resize(1200,630,{fit:"cover"}).png().toFile(process.argv[2])',cache+'/frame-0001.png',str(ROOT/'public/og-media-day-2026-09-28-v2.png')],cwd=ROOT,check=True)
        # Title card and divider share the edition title and cinematic scene.
        if kind=='sting': shutil.copyfile(video,OUT/(name.replace('-sting-','-title-card-')+'.mp4'))
    print('DELIVERED',video,flush=True)

def write_manifest():
    assets=[]
    files=sorted(OUT.glob('*v2.mp4'))+sorted(OUT.glob('*v2.webp'))+sorted(OUT.glob('*v2-poster.webp'))+[ROOT/'public/og-media-day-2026-09-28-v2.png']
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
              'photography':'Packed official Media Day source images; see photo-ledger.json',
              'scene':{'photoPlaneDepths':[-.9,0,.7],'depthOfFieldFstop':3.2,'volumetricDensity':.012,'titleExtrusion':.032,'samples':16},
              'titleCard':'The 2.5-second title card is also the section divider sting; same edition title and light sweep.',
              'savedScenes':[{'file':str(p.relative_to(ROOT)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(BLENDS.glob('*v2.blend'))],
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

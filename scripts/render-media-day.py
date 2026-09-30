"""Render approved still photography as a seamless, silent Blender hero loop.

Run from the repository root:
  blender --background --factory-startup --python scripts/render-media-day.py -- \
    --landscape-photo public/assets/media/source/landscape.jpg \
    --portrait-photo public/assets/media/source/portrait.jpg

Uses Blender's bundled Python, existing ffmpeg/Node, and repository sharp. The saved
.blend files contain packed source textures. Frame caches stay in temporary
storage. The loop samples a periodic camera path at 24 fps for seven seconds;
its next frame is exactly the initial pose (no duplicated endpoint).
"""
import argparse
import math
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

import bpy

ROOT = Path(__file__).resolve().parents[1]
PREFIX = 'media-day-2026-09-28'


def emission(name, color=None, photo=None):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    output = nodes.new('ShaderNodeOutputMaterial')
    shader = nodes.new('ShaderNodeEmission')
    shader.inputs['Strength'].default_value = 1
    if photo:
        image = bpy.data.images.load(str(photo), check_existing=True)
        texture = nodes.new('ShaderNodeTexImage')
        texture.image = image
        material.node_tree.links.new(texture.outputs['Color'], shader.inputs['Color'])
        image.pack()
    else:
        shader.inputs['Color'].default_value = color
    material.node_tree.links.new(shader.outputs[0], output.inputs['Surface'])
    return material


def plane(name, width, height, z, material, x=0, y=0):
    bpy.ops.mesh.primitive_plane_add(size=2, location=(x, y, z))
    obj = bpy.context.object
    obj.name = name
    obj.scale = (width / 2, height / 2, 1)
    obj.data.materials.append(material)
    return obj


def render_variant(photo, width, height, ffmpeg, output_dir, blend_dir):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    # Flat emission planes need no lighting bounces; CPU is reliable headlessly.
    scene.cycles.device = 'CPU'
    scene.cycles.samples = 1
    scene.cycles.use_denoising = False
    scene.cycles.max_bounces = 0
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    scene.render.fps = 24
    scene.frame_start = 1
    scene.frame_end = 168
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGB'
    scene.render.film_transparent = False
    scene.view_settings.view_transform = 'Standard'
    scene.view_settings.look = 'None'
    scene.view_settings.exposure = 0
    scene.view_settings.gamma = 1
    scene.world = bpy.data.worlds.new('Suns purple')
    scene.world.color = (0.012, 0.005, 0.06)

    photo_material = emission('Verified Media Day photograph', photo=photo)
    image = next(node.image for node in photo_material.node_tree.nodes if node.type == 'TEX_IMAGE')
    aspect = width / height
    view_width = 12
    view_height = view_width / aspect
    photo_aspect = image.size[0] / image.size[1]
    image_width = min(view_width * .96, view_height * .94 * photo_aspect)
    image_height = image_width / photo_aspect
    orange = emission('Suns orange', (0.784, 0.117, 0.014, 1))
    purple = emission('Suns purple', (0.012, 0.005, 0.117, 1))
    plane('Purple photographic matte', view_width * 1.3, view_height * 1.3, -.5, purple)
    # Preserve the entire verified photograph. Portrait pictures sit right of
    # the landscape title area; no faces are lost to a landscape cover crop.
    photo_x = (view_width - image_width) / 2 - .3 if aspect > 1 and photo_aspect < 1 else 0
    plane('Media Day photo plane', image_width, image_height, 0, photo_material, x=photo_x)

    # Edge treatments sit forward of the photograph and introduce quiet parallax.
    plane('Orange edge', .065, view_height * 1.2, .65, orange, x=-view_width / 2 + .5)
    plane('Purple edge', .09, view_height * 1.2, .4, purple, x=view_width / 2 - .5)

    bpy.ops.object.camera_add(location=(0, 0, view_width * 50 / 36))
    camera = bpy.context.object
    camera.name = 'Seven-second seamless camera'
    camera.data.type = 'PERSP'
    camera.data.sensor_fit = 'HORIZONTAL'
    camera.data.sensor_width = 36
    camera.data.lens = 50
    camera.rotation_euler = (0, 0, 0)
    scene.camera = camera
    for frame in range(1, 170):
        phase = 2 * math.pi * (frame - 1) / 168
        camera.location.x = .055 * math.sin(phase)
        camera.location.y = .035 * (1 - math.cos(phase))
        camera.keyframe_insert(data_path='location', frame=frame)
        camera.data.lens = 50 + .10 * (1 - math.cos(phase))
        camera.data.keyframe_insert(data_path='lens', frame=frame)

    label = f'{width}x{height}'
    orientation = 'landscape' if width > height else 'portrait'
    scene['photo_source'] = str(photo.relative_to(ROOT))
    scene['loop'] = '7 seconds; 24 fps; 168 unique samples; periodic camera path'
    scene['editorial'] = 'Verified still photography; no synthetic people or inferred live motion'
    scene.frame_set(1)
    scene.render.filepath = '//../../public/assets/media/render-frames/' + label + '/'
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_dir / f'{PREFIX}-{orientation}-v1.blend'))

    with tempfile.TemporaryDirectory(prefix='echo-blender-') as cache:
        scene.render.filepath = cache + '/frame-'
        bpy.ops.render.render(animation=True)
        mp4 = output_dir / f'{PREFIX}-{label}-v1.mp4'
        subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-framerate', '24',
                        '-i', cache + '/frame-%04d.png', '-c:v', 'libx264', '-preset', 'medium',
                        '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
                        str(mp4)], check=True)
        node = shutil.which('node')
        if not node:
            raise RuntimeError('Node and the repository sharp dependency are required for stills')
        poster = output_dir / f'{PREFIX}-{"poster" if width > height else "portrait-poster"}-v1.webp'
        subprocess.run([node, '-e', 'require("sharp")(process.argv[1]).webp({quality:92}).toFile(process.argv[2]).catch(e=>{console.error(e);process.exit(1)})', cache + '/frame-0001.png', str(poster)], cwd=ROOT, check=True)
        if width > height:
            subprocess.run([node, '-e', 'require("sharp")(process.argv[1]).resize(1200,630,{fit:"cover"}).png().toFile(process.argv[2]).catch(e=>{console.error(e);process.exit(1)})', cache + '/frame-0001.png', str(output_dir / f'{PREFIX}-og-plate-v1.png')], cwd=ROOT, check=True)
    print('DELIVERED', mp4, flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--landscape-photo', type=Path, required=True)
    parser.add_argument('--portrait-photo', type=Path)
    parser.add_argument('--variant', choices=['both', 'landscape', 'portrait'], default='both')
    args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
    ffmpeg = shutil.which('ffmpeg')
    if not ffmpeg:
        raise RuntimeError('ffmpeg must already be installed')
    landscape = args.landscape_photo.resolve()
    portrait = (args.portrait_photo or args.landscape_photo).resolve()
    for photo in (landscape, portrait):
        if not photo.is_file():
            raise FileNotFoundError(photo)
        photo.relative_to(ROOT)
    output_dir = ROOT / 'public/assets/media'
    blend_dir = ROOT / 'assets/blender'
    output_dir.mkdir(parents=True, exist_ok=True)
    blend_dir.mkdir(parents=True, exist_ok=True)
    if args.variant in ('both', 'landscape'):
        render_variant(landscape, 1920, 1080, ffmpeg, output_dir, blend_dir)
    if args.variant in ('both', 'portrait'):
        render_variant(portrait, 1080, 1920, ffmpeg, output_dir, blend_dir)


if __name__ == '__main__':
    main()

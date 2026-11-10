#!/usr/bin/env python3
"""Boston Molasses Flood: 12-second Blender continuity and camera test.

This is a technical animation test (NOT final approved artwork). It uses
physical 3D sets, a consistent stylized character rig, independent animation
of a shell rupture, a 3D wave, flying rivets and continuous camera shots.
The final character sprites and illustration textures still need import.
"""
import bpy
import math
from mathutils import Vector
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "output" / "frames"
OUT.mkdir(parents=True, exist_ok=True)
FPS = 24
FRAMES = 12 * FPS
def frame(sec): return 1 + round(sec * FPS)
def material(name, rgb):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*rgb, 1.0)
    return m
M = {
    "brick": material("Old north-end brick", (.48,.23,.17)),
    "brick2": material("Deep red brick", (.34,.13,.11)),
    "stone": material("Warm stone", (.66,.55,.41)),
    "street": material("Gray cobblestone", (.27,.25,.24)),
    "tank": material("Iron brown", (.34,.28,.27)),
    "iron": material("Black iron", (.10,.10,.105)),
    "rust": material("Rust", (.60,.25,.11)),
    "molasses": material("Dark molasses", (.23,.071,.025)),
    "molasses2": material("Molasses highlights", (.40,.135,.055)),
    "shirt": material("Ivory rolled sleeve shirt", (.87,.82,.70)),
    "skin": material("Warm complexion", (.90,.66,.49)),
    "hair": material("Dark hair", (.15,.105,.09)),
    "cap": material("Brown newsboy cap", (.42,.33,.26)),
    "trousers": material("Brown work trousers", (.33,.22,.17)),
    "leather": material("Boots", (.18,.13,.10)),
    "white": material("White eyes", (.99,.95,.85))
}
def cube(name, loc, size, mat, parent=None, bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    ob = bpy.context.object
    ob.name = name
    ob.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    ob.data.materials.append(mat)
    if bevel:
        m=ob.modifiers.new("Soft edges", "BEVEL")
        m.width=bevel
        m.segments=2
        ob.modifiers.new("Normals", "WEIGHTED_NORMAL")
    if parent: ob.parent=parent
    return ob
def ball(name, loc, scl, mat, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=14, ring_count=8, location=loc)
    ob=bpy.context.object
    ob.name=name
    ob.scale=scl
    ob.data.materials.append(mat)
    if parent: ob.parent=parent
    return ob
def empty(name, loc, parent=None):
    ob=bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(ob)
    ob.location=loc
    if parent: ob.parent=parent
    return ob
def cylinder(name, loc, radius, depth, mat, vertices=48):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    ob=bpy.context.object
    ob.name=name
    ob.data.materials.append(mat)
    return ob
def track(cam, at):
    cam.rotation_euler=(Vector(at)-cam.location).to_track_quat("-Z","Y").to_euler()
def key(ob, sec, prop, value):
    setattr(ob, prop, value)
    ob.keyframe_insert(data_path=prop, frame=frame(sec))
def visible_from(obj, sec):
    obj.hide_render=True; obj.keyframe_insert(data_path="hide_render",frame=1)
    obj.hide_render=False; obj.keyframe_insert(data_path="hide_render",frame=frame(sec))
    if obj.animation_data:
        for fc in obj.animation_data.action.fcurves:
            for kp in fc.keyframe_points: kp.interpolation="CONSTANT"

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
s=bpy.context.scene
s.render.engine="BLENDER_WORKBENCH"
s.display.shading.color_type="MATERIAL"
s.display.shading.light="STUDIO"
s.display.shading.show_shadows=True
s.display.shading.show_cavity=True
s.display.shading.cavity_type="BOTH"
s.display.shading.background_type="WORLD"
s.display.shading.background_color=(.72,.64,.55)
s.render.resolution_x=960
s.render.resolution_y=540
s.render.resolution_percentage=100
s.render.fps=FPS
s.frame_start=1
s.frame_end=FRAMES
s.render.image_settings.file_format="PNG"
s.render.image_settings.color_mode="RGB"
s.render.filepath=str(OUT/"frame_")
try: s.view_settings.view_transform="Standard"
except Exception: pass

# Real 3D North End street: no cards pretending to be animation.
cube("Street",(0,0,-.13),(35,27,.22),M["street"])
for x in range(-15,16,3):
    cube("Cobblestone seam", (x,0,.004), (.07,27,.012), M["stone"])
for side in (-1,1):
    for i in range(5):
        x=-13 + i*3.3
        y=8.5 if side==1 else -9
        # Keep southern buildings lower so the foreground character is visible
        height=6.4 if side==1 else 2.0
        cube("1919 brick rowhouse", (x,y,height/2), (3.1,2.2,height),
             M["brick"] if i%2 else M["brick2"], bevel=.06)
        for z in ([1.6,3.9,5.5] if side==1 else [1.2]):
            for dx in (-.7,.7):
                if side==1:
                    cube("Recessed iron window",(x+dx,y-1.17,z),(.52,.05,.85),M["iron"],bevel=.025)
        cube("Rooftop cap",(x,y,height+.08),(3.18,2.3,.16),M["stone"])
# Tank is near side of road, not behind characters.
cylinder("Giant riveted steel tank",(5,5,4.7),2.65,4.6,M["tank"],64)
for z in (2.6,3.6,4.65,5.7,6.7):
    cylinder("Riveted seam",(5,5,z),2.69,.07,M["iron"],64)
    for k in range(24):
        a=2*math.pi*k/24
        ball("Steel rivet",(5+2.73*math.cos(a),5+2.73*math.sin(a),z),(.055,.055,.055),M["rust"])
for dx in (-1.6,1.6):
    for dy in (-1.6,1.6):
        cube("Tank supports",(5+dx,5+dy,1.1),(.19,.19,2.2),M["iron"])
for j in range(13):
    cube("Ladder rung",(2.28,4.52,2.55+j*.32),(.47,.12,.055),M["stone"])
for x in (2.02,2.54):
    cube("Ladder rail",(x,4.52,4.5),(.055,.055,4.2),M["iron"])
# Dark, widening break at front of shell.
rupture=ball("Rupture hole",(5,2.36,4.22),(1.05,.12,1.25),M["iron"])
key(rupture,0,"scale",(.001,.001,.001))
key(rupture,5.5,"scale",(.001,.001,.001))
key(rupture,6.3,"scale",(1.15,.16,1.42))
for i in range(12):
    p=ball("Burst rivet debris %02d"%i,(5,2.17,4.1),(.11,.07,.09),M["iron"])
    at=Vector((5+(i%3)*.16,2.17+(i%4)*.1,4.1+i*.07))
    away=at+Vector(((-1)**i*(.5+i%5*.18),-2.7-i%4*.4,(i%3)*.3))
    key(p,0,"scale",(.0001,)*3)
    key(p,5.7,"scale",(.0001,)*3)
    key(p,6.1,"scale",(.11,.07,.09))
    key(p,5.7,"location",at)
    key(p,8.4,"location",away)
# Real independently animated viscous wave and droplets.
wave=empty("Animated Molasses wave",(5,1.7,0))
for i in range(9):
    b=ball("Molasses wave crest",(-.9+i*.25,0,.55+(i%3)*.12),
           (.9,.75,.57), M["molasses2"] if i%4==0 else M["molasses"], wave)
for i in range(12):
    b=ball("Liquid spray",(.4+i%4*.20,-.2+i%3*.3,1.5+i%5*.24),(.12,.14,.15),M["molasses2"],wave)
key(wave,0,"scale",(.001,.001,.001))
key(wave,5.9,"scale",(.001,.001,.001))
key(wave,6.25,"scale",(1,1,1))
key(wave,6.25,"location",(5,2.3,0))
key(wave,9.0,"location",(0,-2.4,0))
key(wave,12,"location",(-6,-7,0))
key(wave,9.0,"scale",(3.0,2.0,1.35))
key(wave,12,"scale",(4.0,2.4,1.2))

# Reusable cartoon character rig with independent body, arms and legs.
worker=empty("Boston worker - continuous identity",(-3,-4.8,0))
torso=cube("White shirt",(0,0,1.88),(.80,.40,1.10),M["shirt"],worker,.10)
for x in (-.32,.32):
    cube("Brown suspenders",(x,-.23,1.88),(.10,.06,1.0),M["trousers"],worker,.01)
ball("Head",(0,-.07,2.68),(.47,.35,.48),M["skin"],worker)
ball("Hair",(0,.02,2.99),(.44,.32,.22),M["hair"],worker)
ball("Cap crown",(0,-.04,3.08),(.58,.40,.18),M["cap"],worker)
cube("Cap brim",(0,-.38,2.99),(1.06,.32,.09),M["cap"],worker,.06)
for x in (-.16,.16):
    ball("Fearful eye",(x,-.403,2.77),(.055,.03,.10),M["iron"],worker)
ball("Shouting mouth",(0,-.425,2.47),(.12,.045,.14),M["iron"],worker)
hips=cube("Trouser waist",(0,0,1.27),(.78,.47,.44),M["trousers"],worker,.08)
arms=[]; legs=[]
for i,sgn in enumerate((-1,1)):
    arm=empty("Arm %d pivot"%i,(sgn*.51,0,2.23),worker)
    cube("Sleeve",(0,0,-.28),(.29,.38,.55),M["shirt"],arm,.07)
    ball("Hand",(0,-.04,-.67),(.18,.16,.19),M["skin"],arm)
    arms.append(arm)
    leg=empty("Leg %d pivot"%i,(sgn*.24,0,1.12),worker)
    cube("Trouser leg",(0,0,-.49),(.34,.44,.92),M["trousers"],leg,.05)
    cube("Boot",(0,-.1,-.98),(.4,.66,.20),M["leather"],leg,.045)
    legs.append(leg)
key(worker,0,"location",(-3,-4.8,0))
key(worker,8.4,"location",(-3,-4.8,0))
key(worker,12,"location",(-9,-4.8,0))
for f in range(frame(8.4), FRAMES+1, 3):
    phase=(f-frame(8.4))/9.0
    for i in range(2):
        sgn=-1 if i==0 else 1
        arms[i].rotation_euler[1]=sgn*.7*math.sin(phase*math.pi)
        arms[i].keyframe_insert(data_path="rotation_euler",frame=f)
        legs[i].rotation_euler[1]=-sgn*.8*math.sin(phase*math.pi)
        legs[i].keyframe_insert(data_path="rotation_euler",frame=f)
    worker.location.z=.045*abs(math.sin(phase*math.pi))
    worker.keyframe_insert(data_path="location",frame=f)

def add_camera(name, starts, end, lens):
    cd=bpy.data.cameras.new(name)
    ob=bpy.data.objects.new(name,cd)
    bpy.context.collection.objects.link(ob)
    for sec,pos,target,zoom in starts:
        ob.location=pos
        track(ob,target)
        cd.lens=zoom
        ob.keyframe_insert(data_path="location",frame=frame(sec))
        ob.keyframe_insert(data_path="rotation_euler",frame=frame(sec))
        cd.keyframe_insert(data_path="lens",frame=frame(sec))
    mark=s.timeline_markers.new(name,frame=frame(end))
    mark.camera=ob
    return ob
a=add_camera("01 Establishing",[(0,(-1,-22,9),(2,3,2.8),34),(2.9,(-.5,-18,8),(3.4,4,3.2),38)],0,34)
add_camera("02 Tank stress",[(3,(8,-10,7),(5,5,4.5),70),(5.5,(7,-8,6),(5,5,4.3),88)],3,70)
add_camera("03 Rupture",[(5.5,(6,-17,7),(5,4,3.8),42),(8.4,(2,-15,5),(4,3,3),48)],5.5,42)
add_camera("04 Tracking escape",[(8.4,(-3,-13,5),(-3,-4,1.6),56),(12,(-9,-13,5),(-9,-4,1.6),56)],8.4,56)
s.camera=a
print("MOLASSES_TEST_READY",s.render.filepath,"frames",FRAMES,"cameras",4,flush=True)
bpy.ops.render.render(animation=True)

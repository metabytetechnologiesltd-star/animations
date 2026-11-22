#!/usr/bin/env python3
"""Generate voice tracks for code-animated documentaries via ElevenLabs.

Usage:
  ELEVENLABS_API_KEY=... ELEVENLABS_NARRATOR_VOICE_ID=... \
  ELEVENLABS_DIRECTOR_VOICE_ID=... ELEVENLABS_ANALYST_VOICE_ID=... \
  python scripts/elevenlabs/render_voices.py \
      --input scripts/elevenlabs/barings_lines.json --output voices

Never commit API keys or generated voice files.
"""
import argparse
import json
import os
import pathlib
import re
import sys
import urllib.error
import urllib.request

ENDPOINT = "https://api.elevenlabs.io/v1/text-to-speech"

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--input",required=True)
    ap.add_argument("--output",default="voices")
    ap.add_argument("--model",default="eleven_multilingual_v2")
    args=ap.parse_args()
    key=os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("ELEVENLABS_API_KEY is missing. Set it as a secret, never in code.")
    voices={
        "narrator":os.environ.get("ELEVENLABS_NARRATOR_VOICE_ID"),
        "director":os.environ.get("ELEVENLABS_DIRECTOR_VOICE_ID"),
        "analyst":os.environ.get("ELEVENLABS_ANALYST_VOICE_ID"),
    }
    data=json.loads(pathlib.Path(args.input).read_text(encoding="utf-8"))
    for item in data["lines"]:
        role=item["speaker"].lower()
        if role not in voices or not voices[role]:
            sys.exit(f"Missing voice ID for speaker: {role}")
    out=pathlib.Path(args.output)
    out.mkdir(parents=True,exist_ok=True)
    manifest=[]
    for index,item in enumerate(data["lines"],start=1):
        role=item["speaker"].lower()
        voice=voices[role]
        stem=re.sub(r"[^a-zA-Z0-9_-]","_",item.get("id",str(index)))[:80]
        filename=f"{index:02d}_{role}_{stem}.mp3"
        body=json.dumps({
            "text":item["text"],
            "model_id":args.model,
            "voice_settings":{"stability":0.45,"similarity_boost":0.75},
        }).encode("utf-8")
        req=urllib.request.Request(
            f"{ENDPOINT}/{voice}?output_format=mp3_44100_128",
            data=body,
            headers={"xi-api-key":key,"Content-Type":"application/json","Accept":"audio/mpeg"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req,timeout=120) as response:
                audio=response.read()
        except urllib.error.HTTPError as exc:
            # Do not print headers or request objects, which may contain credentials.
            sys.exit(f"ElevenLabs generation failed at line {index}: HTTP {exc.code}. Check credit, permissions and voice IDs.")
        (out/filename).write_bytes(audio)
        manifest.append({"id":item.get("id"),"speaker":role,"text":item["text"],"file":filename})
        print(f"Created {filename} ({len(audio)} bytes)")
    (out/"voice_manifest.json").write_text(json.dumps({"lines":manifest},indent=2),encoding="utf-8")
    print(f"Complete: {len(manifest)} voice segments in {out}")

if __name__=="__main__":
    main()

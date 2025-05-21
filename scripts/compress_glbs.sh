#!/bin/bash

for f in *.glb; do
  out="${f%.glb}-compressed.glb"
  echo "compressing $f → $out"
  gltf-transform optimize "$f" "$out" --compress draco --texture-compress webp
done

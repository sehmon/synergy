for f in *.mp4; do
  ffmpeg -y -i "$f" -filter_complex \
  "[0:v]reverse[vrev];[0:v][vrev]concat=n=2:v=1:a=0[vout]" \
  -map "[vout]" \
  "${f%.mp4}_looped.mp4"
done

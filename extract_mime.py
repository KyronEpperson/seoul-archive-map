import sys, json, base64, email, os
from email import policy

src, out_dir, msg_id = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out_dir, exist_ok=True)
with open(src) as f:
    data = json.load(f)
raw = data["raw"]
raw_bytes = base64.urlsafe_b64decode(raw + "=" * (-len(raw) % 4))
msg = email.message_from_bytes(raw_bytes, policy=policy.default)
body = ""
saved = []
for part in msg.walk():
    ct = part.get_content_type()
    if ct == "text/plain" and not body:
        body = part.get_content()
    if ct.startswith("image/"):
        ext = "png" if ct == "image/png" else ct.split("/")[1]
        p = os.path.join(out_dir, f"{msg_id}.{ext}")
        with open(p, "wb") as f:
            f.write(part.get_payload(decode=True))
        saved.append(p)
print(json.dumps({"subject": msg["subject"], "body": body.strip(), "saved": saved}))

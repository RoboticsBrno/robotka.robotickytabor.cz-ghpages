#!/usr/bin/env python3

import argparse
import os
import re
import subprocess
import sys

def is_img_present(fn):
    return subprocess.call([ "rg", "-iq", re.escape(fn) ]) == 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", "-n", action="store_true", help="Don’t actually remove anything, just show what would be done.")
    parser.add_argument("--force", "-f", action="store_true", help="Remove the images.")

    args = parser.parse_args()

    if args.dry_run == args.force:
        print("Specify one of -n, -f!", file=sys.stderr)
        sys.exit(1)

    unused = []
    for root, dirs, files in os.walk("img"):
        if not root.endswith("/original"):
            continue

        for fn in files:
            if not is_img_present(fn):
                unused.append(os.path.join(root, fn))

    print("Unused images:")
    total_size = 0
    for fn in unused:
        size = os.stat(fn).st_size
        total_size += size
        print("  %s %.2f MiB" % (fn, size/1024/1024))
    print("Total size: %.2f MiB" % (total_size/1024/1024))

    if not args.force:
        sys.exit(0)
    
    for fn in unused:
        os.remove(fn)
    print(f"Removed {len(unused)} files.")

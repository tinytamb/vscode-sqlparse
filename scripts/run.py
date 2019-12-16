#!/usr/bin/env python3

import sys
import os
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(str(current_dir) + '/lib')
import sqlparse  # pylint: disable=import-error

args = sys.argv
input_lines = sys.stdin.read()

# ==== settings ==== #
settings = {}

# keyword_case
settings["keyword_case"] = args[1] if args[1] != "" else None
# identifier_case
settings["identifier_case"] = args[2] if args[2] != "" else None
# strip_comments
settings["strip_comments"] = True if args[3] == "true" else False
# reindent
settings["reindent"] = True if args[4] == "true" else False
# indent_tabs
settings["indent_tabs"] = True if args[5] == "true" else False
# indent_width
settings["indent_width"] = int(args[6])
# output_format
settings["output_format"] = args[7]


# ==== run ==== #
result = sqlparse.format(input_lines, **settings)
# result = sqlparse.format(input_lines, reindent=True, keyword_case='upper')
# === debug
# print(args)
# print(settings)

# === result
print(result)

# sqlparse for Visual Studio Code

Format SQL Code.

![screenshot](https://github.com/tinytamb/vscode-sqlparse/raw/master/images/screenshot.gif)

* This Visual Studio Code extension uses [python-sqlparse](https://code.google.com/p/python-sqlparse/) for sql formatting.
* Inspired by [SqlBeautifier](https://github.com/zsong/SqlBeautifier)  for Sublime Text.

## Requirements

* Python (Recommend: Python version >= 3.4)

## Visual Studio Marketplace

[sqlparse for Visual Studio Code - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=tinytamb.vscode-sqlparse)

## Extension Settings

### Default Settings

```json
"sqlparse.identifierCase": "Unchanged",
"sqlparse.indentTabs": false,
"sqlparse.indentWidth": 2,
"sqlparse.keywordCase": "Upper case",
"sqlparse.outputFormat": "SQL",
"sqlparse.pythonPath": "/usr/bin/python3",
"sqlparse.stripComments": false
```

* Use as an argument to the format() function. (python-sqlparse module)
* See the [Formatting of SQL Statements](https://sqlparse.readthedocs.io/en/latest/api/) for details.

```py
# [python-sqlparse]
# @see **options
sqlparse.format(sql, encoding=None, **options)
```

### Format On Save

```json
"[sql]": {
    "editor.defaultFormatter": "tinytamb.vscode-sqlparse",
    "editor.formatOnSave": true
},
```

* For more information, see [Visual Studio Code User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings#_language-specific-editor-settings)

## Libraries

* [python-sqlparse](https://github.com/andialbrecht/sqlparse) (New BSD license)
* [python-shell](https://github.com/extrabacon/python-shell) (MIT)

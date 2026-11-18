---
sidebar_position: 1
title: Prerequisites
description: Verify your local terminal, curl, Node.js, or Python setup before generating your OpenWeatherMap API key.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Prerequisites

Confirm that your local development environment has a command-line terminal and at least one supported runtime before starting. You don't need an OpenWeatherMap account or API key yet—you'll create both for free on the next page, [Get your API key](./get-api-key).

## Local tools

- **Terminal and `curl`:** Preinstalled on macOS, most Linux distributions, and Windows 10 or later for sending HTTP requests directly from your shell.
- **Language runtime (choose one or both for code examples and tutorials):**
  - **Node.js 20 LTS or later:** Recommended for the JavaScript examples and the Node.js dashboard tutorial. Node.js 18 and later include a built-in `fetch` implementation, so you don't need external HTTP packages. Download the LTS installer from the [Node.js downloads page](https://nodejs.org/en/download).
  - **Python 3.10 or later with `requests`:** Recommended for the Python examples and the Python CLI tutorial. Download the latest installer from the [Python downloads page](https://www.python.org/downloads/).
- **Code editor:** [Visual Studio Code](https://code.visualstudio.com/) or another text editor for authoring `.mjs` and `.py` scripts.
- **REST fundamentals:** Familiarity with running terminal commands, reading HTTP status codes, and inspecting JSON objects.

## Verify your local tools

Run the commands for your operating system to confirm that `curl` and your preferred language runtime are available on your `PATH`.

### Verify curl

<Tabs groupId="os">
<TabItem value="unix" label="macOS / Linux" default>

```bash
curl --version
```

**Expected output:**

```text
curl 8.7.1 (x86_64-apple-darwin23.0) libcurl/8.7.1 ...
```

</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

In Windows PowerShell, `curl` is a built-in alias for `Invoke-WebRequest`. Run `curl.exe` explicitly to invoke the native `curl` binary:

```powershell
curl.exe --version
```

**Expected output:**

```text
curl 8.9.1 (Windows) libcurl/8.9.1 Schannel WinIDN ...
```

</TabItem>
</Tabs>

### Verify Node.js

If you plan to follow the JavaScript examples or the Node.js tutorial, verify your Node.js version:

<Tabs groupId="os">
<TabItem value="unix" label="macOS / Linux" default>

```bash
node --version
```

**Expected output:**

```text
v20.18.0
```

</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

```powershell
node --version
```

**Expected output:**

```text
v20.18.0
```

</TabItem>
</Tabs>

Any version of `v18.0.0` or later supports native `fetch`, and **Node.js 20 LTS or later** is recommended.

### Verify Python and install requests

If you plan to follow the Python examples or the Python CLI tutorial, verify your Python version and install the `requests` package:

<Tabs groupId="os">
<TabItem value="unix" label="macOS / Linux" default>

```bash
python3 --version
python3 -m pip install requests
```

**Expected output:**

```text
Python 3.12.6
Successfully installed ... requests-2.32.3 ...
```

</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

```powershell
python --version
python -m pip install requests
```

**Expected output:**

```text
Python 3.12.6
Successfully installed ... requests-2.32.3 ...
```

</TabItem>
</Tabs>

:::tip Isolate Python dependencies in projects
For multi-file projects and tutorials, create a project-scoped virtual environment (`.venv`) before installing packages. The [Build a weather CLI tool in Python](../tutorials/weather-cli) tutorial walks through virtual environment setup step by step.
:::

## Next step

Continue to [Get your API key](./get-api-key) to create your free OpenWeatherMap account, store your key in an environment variable, and verify activation.

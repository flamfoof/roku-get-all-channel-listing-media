# Roku Channel Listing Media Fetcher

This project allows you to fetch channel listings and media information from Roku devices. It's designed to be runtime-agnostic, supporting multiple JavaScript environments for maximum flexibility.

## 🚀 Runtime Support

### Bun
[Bun](https://bun.sh/) is the recommended runtime for this project due to its blazing-fast performance and built-in features:
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Run the project
bun run roku_get_ch.js
```

### Deno
[Deno](https://deno.land/) offers secure runtime by default and TypeScript support out of the box:
```bash
# Install Deno
curl -fsSL https://deno.land/x/install/install.sh | sh

# Run the project
deno run --allow-net roku_get_ch.js
```

### Node.js
Traditional [Node.js](https://nodejs.org/) is also supported:
```bash
# Install Node.js from https://nodejs.org/
# Then run:
node roku_get_ch.js
```

## 📦 Dependencies
This project is designed to work with minimal dependencies, leveraging the built-in features of each runtime.

## 🔒 Security
Make sure to review the network permissions when running with Deno, as it requires explicit permission grants for network access.

## 📝 License
MIT

Feel free to contribute to this project by submitting issues or pull requests!

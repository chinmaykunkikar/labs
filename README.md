# labs

Small experiments and interactive demos. Each experiment is a self-contained component that can be imported as a package.

## Experiments

### [graceful-spinner](/graceful-spinner)

A refresh button spinner that finishes its current rotation before stopping, instead of snapping back mid-spin. Side-by-side comparison of abrupt vs graceful behavior.

## Development

```sh
npm install
npm run dev
```

## Use as a package

Add to your project as a git dependency:

```json
{
  "labs": "github:chinmaykunkikar/labs"
}
```

Import the experiment:

```tsx
import { GracefulSpinnerDemo } from "labs/graceful-spinner";
```

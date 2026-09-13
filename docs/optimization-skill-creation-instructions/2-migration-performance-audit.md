# 🔍 WSL Environment, Git Continuity, & Core Web Vitals Invariant Protocol

## 🛠️ Step 0: Git History & Remote Continuity Invariant

To preserve the absolute developmental lineage of this project, you must operate within the strict boundaries of the existing repository:

1. **No Destructive Git Actions:** You are strictly forbidden from running `git init` or clearing the existing history.
2. **Commit Lineage Continuity:** Every refactoring change, structural fix, or optimization step must be committed directly on top of the old project's existing commit history.
3. **Remote Preservation:** Maintain absolute connectivity to the exact same GitHub repository. Verify that `git remote -v` maps safely to your upstream GitHub target before staging any atomic refactoring updates.

---

## 🧭 Step 1: Cross-Environment Migration & Workspace Scrubbing

To eliminate any operational anomalies caused by migrating the repository from Windows NTFS over to the Linux WSL filesystem (`/home/sina/projects/personal-portfolio`), the engine must enforce these validation checks:

1. **Line-Ending Normalization:** Recursively verify and convert all source files from Windows `CRLF` format to native Linux `LF` format.
2. **Strict Case-Sensitivity Audit:** Scan all module imports and file mappings. Ensure every import string matches the exact character casing on the Linux disk to prevent production build failures on Vercel.
3. **Dependency Pruning:** Cleanse `package.json` of any bloated, obsolete, or duplicate rendering engines.

---

## 🛡️ Step 2: Core Web Vitals Invariant Protocols (Fail-Closed Gates)

### Invariant F-1: Image Optimization Pipeline

- Every image asset must pass exclusively through the native `next/image` wrapper.
- Missing explicit aspect ratios or missing responsive `sizes` parameters will cause an immediate build rejection.
- Hero sections and above-the-fold graphics must use the `priority` attribute.

### Invariant F-2: Typography & Shift Defense

- Load all fonts using the native `next/font` layer.
- Implement custom fallback systems paired with calculated size-adjust metrics to entirely eliminate Cumulative Layout Shift (CLS) during text font swapping.

### Invariant F-3: Code Splitting & Lazy Resolution

- Any interactive layout block or heavy animation utility consuming more than 15KB of client-side JS bundle space must be dynamically loaded with server-side pre-rendering enabled:
  ```typescript
  import dynamic from "next/dynamic";
  const InteractiveWidget = dynamic(() => import("./Widget"), { ssr: true });
  ```

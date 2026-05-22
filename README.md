# Batch 0 — Foundation

Three primitives + motion tokens. Invisible in production until Batch 1 hooks them in.

## What's in this zip

```
lib/motion.ts                              motion tokens (new)
components/primitives/animated-number.tsx  smooth count-up (new)
components/primitives/state-pill.tsx       animated job state badge (new)
components/primitives/living-background.tsx flowing pink/blue shader (new)
app/_batch0/page.tsx                       preview route, deleted in Batch 5
```

All five files are new. No existing files overwritten.

## One surgical edit you do manually

Open `next.config.mjs` and remove `ignoreBuildErrors: true` (or whatever its
TypeScript-ignoring equivalent is). It was a migration band-aid; it has to go
before the rebuild starts or we'll ship broken types into the dashboard.

If something downstream breaks the build after this, paste the error and I'll
fix it. Don't add the flag back.

## Install

```powershell
cd $env:USERPROFILE\Documents\GitHub\claimr
Move-Item -Path "$env:USERPROFILE\Downloads\claimr-batch0.zip" -Destination "$env:USERPROFILE\Documents\GitHub\" -ErrorAction SilentlyContinue
Expand-Archive -Path "$env:USERPROFILE\Documents\GitHub\claimr-batch0.zip" -DestinationPath . -Force
npm install motion
```

Verify Expand-Archive didn't no-op:

```powershell
git status
```

You should see 5 new files staged for the next commit. If `git status` is
clean, the zip silently failed — extract manually via File Explorer.

## Verify locally before pushing

```powershell
npm run dev
```

Visit `http://localhost:3000/_batch0` and check:

1. **Living background** is rendering — slow flowing pink/blue noise field on a dark base. Move your mouse, the field shifts. Switch tabs and back, it pauses.
2. **Animated number** counts up smoothly when you click the buttons.
3. **State pill** crossfades label + color when you click "Cycle state". "Under review" has a pulsing dot.

If all three feel right, commit and ship:

```powershell
git add -A
git commit -m "batch 0: foundation primitives and motion tokens"
git push https://iam25th1@github.com/iam25th1/claimr.git
```

## Then reply "Batch 0 green" and we go to Batch 1.

## What Batch 1 does next

Project dashboard rebuilt around these primitives:

- `/project` — escrow total as a breathing AnimatedNumber hero
- `/project/jobs` — job cards with StatePill, layout transitions when status changes
- `/project/escrow` — locked-funds visualization, USDC fly-to-creator on payout
- `/project/jobs/[id]` — detail with verify/reject controls

Each job card lives on the LivingBackground. The dashboard is what judges see first.

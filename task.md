We need to make a fully working demo frontend
It will not be a production ready code
It will not be updated/maintaned after the demo

Check `referecnce_images/` for ui images
You can make creative changes to ui
Check `documentation.pdf` for any project info
Check readme.md in frontend for frontend reference, do not install packages again, check package.json

Always check latest docs before writing any code, the versions have updated significantly.

The project uses TanStack Start for the UI (located in the `frontend` directory), configured with:
- Eslint
- Nitro
- Query
- Forms
- Shadcn

Tailwind CSS and TanStack Router are integrated.

We are using FastAPI for the backend; check `backend/` for any backend code.
Convert the backend Pydantic schemas to appropriate Zod schemas for frontend validation.
Frontend should handle form validation, loading, result(errors, validation errors, success)
Shadcn has tutorial to use tanstack forms with their field component, check it out in their docs

# Pages:
- Home (static page with cta to /predict)
- Predict (the actual form page)
    - form inputs with tanstack form, shadcn, zod validation
    - Shadcn has new field component, it also excellent info on how to use it along with tanstack forms, check out the docs
    - Liver disease detected or not card/banner with confidence score
    - Insights like this is low, that is high below it
- About (static page)
- How it works (static page)
- Contact (static page)

# Frontend suggestions while staying close to reference images:
## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines
- **Typography**: Select distinctive font pairings. Avoid generic system fonts like Inter or Arial. Use a characterful display font for headings and a highly legible, refined font for body text.
- **Color & Theme**: Define a bold, cohesive palette using Tailwind CSS variables. Prioritize high-contrast accents and intentional color theory over safe, muted schemes.
- **Motion**: Use Tailwind CSS transitions and keyframe animations for micro-interactions and page reveals. Focus on high-impact, staggered entry animations. Do not use external libraries like Framer Motion; keep animations lightweight and CSS-driven.
- **Spatial Composition**: Break the grid with asymmetric layouts, overlapping elements, and purposeful negative space. Ensure the layout feels dynamic and intentional.
- **Atmosphere**: Use gradient meshes, noise textures, or subtle geometric patterns to create depth. Avoid flat, solid backgrounds in favor of layered visual interest

**Constraint**: Avoid generic "AI-style" designs (e.g., Inter font, purple/blue gradients). Every project should have a unique, context-specific aesthetic identity. Execute with precision—whether minimalist or maximalist, the quality lies in the details.

Final note:
- Checking docs before coding is mandatory
- Use typescript
- Don't do testing, i will do it myself
- We are using pwsh 7 as shell, so use that syntax if needed
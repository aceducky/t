Running this code:

## Model setup
Make sure to run the model.ipynb to get model pkl file(its already available in backend folder)


## Backend setup (in one terminal)

### Install dependencies
```sh
cd backend
uv pip install -r requirements.txt
```

### Run server
```sh
uvicorn.exe app:app  --port 8000
```

## Frontend setup (in another terminal)

### Install dependencies

```sh
cd frontend
npm install
```

### Run server
```sh
npm run dev
```

Go to localhost:8000
---

Default branch is bad_animations, its the default branch and it has bad animations

---

To see less bad animations, switch to master branch
(Ctrl+c the servers first)

Run this:
```sh
git switch master
```
in new terminal for convinience, you can do it in the same terminal as backend/frontend

Run servers again in those stopped servers terminals

---
master branch has requirements.txt in project/ folder
so if you want to install dependencies in master branch, do it in project/ folder

```sh
cd project
uv pip install -r requirements.txt
```
---

HAPPY CODING

# Git / evidencia de branching — Sumativa 2

El repositorio ya existe en GitHub. No hagas `git init` nuevamente ni fuerces `main`.

Desde la raíz del proyecto:

```powershell
git status
git branch --show-current
git remote -v
```

1. Guardar primero cualquier cambio de Angular pendiente en la rama donde estés:

```powershell
git add frontend-angular
git commit -m "Sumativa 2: Angular foro y formularios"
```

2. Crear una rama corta para infraestructura desde el estado actual:

```powershell
git switch -c feature/s2-docker-arquetipo
git add .gitignore .env.example compose.yaml frontend-angular/Dockerfile frontend-angular/nginx.conf frontend-angular/.dockerignore usuarios-service/Dockerfile usuarios-service/.dockerignore foro-service/Dockerfile foro-service/.dockerignore microservicio-arquetipo docs
git status --short
git commit -m "Sumativa 2: arquetipo Maven y contenedores Docker"
git push -u origin feature/s2-docker-arquetipo
```

3. Tras probar y revisar, fusionar con la rama base (puede ser `feature/sumativa2-angular`
   si has trabajado en ella; luego integra en `main`). Usa `git merge --no-ff`
   y `git push` tras verificar que no hay conflictos.

No ejecutes `git push --force`. Antes de hacer `git add .`, revisa con `git status` para
confirmar que no aparezcan claves o el Wallet en los cambios. Evita que los repositorios
públicos publiquen contraseñas usadas en las sesiones anteriores.

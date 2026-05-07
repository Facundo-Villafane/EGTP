# EGTP Got Talent — Setup

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore, Hosting)

## Inicio rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Creá un proyecto en [Firebase Console](https://console.firebase.google.com).
2. Habilitá **Authentication → Google**.
3. Creá una **Firestore Database** (modo producción).
4. Copiá las credenciales del proyecto:

```bash
cp .env.example .env
# Completá los valores de VITE_FIREBASE_*
```

### 3. Deployar reglas de Firestore

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # seleccioná tu proyecto
firebase deploy --only firestore
```

### 4. Crear el primer admin

Después de iniciar sesión por primera vez con Google, buscá el documento
`users/{tu-uid}` en Firestore Console y cambiá el campo `role` de `"employee"` a `"admin"`.

### 5. Correr en desarrollo

```bash
npm run dev
```

### 6. Build y deploy

```bash
npm run build
firebase deploy
```

---

## Documento de settings

Al iniciar la app, si no existe el documento `settings/event`, la app usa defaults seguros
(inscripción abierta, votación cerrada, resultados ocultos).

Para inicializarlo manualmente en Firestore Console:

```
Collection: settings
Document ID: event

registrationOpen: true
votingOpen: false
showResults: false
eventTitle: "EGTP Got Talent"
registrationDeadline: null
votingDeadline: null
```

---

## Estructura del proyecto

```
src/
  components/     # Componentes reutilizables
  context/        # AuthContext (estado de autenticación global)
  lib/            # Inicialización de Firebase
  pages/          # Home y Admin
  services/       # Lógica de Firestore (auth, talent, vote, settings)
  types/          # Interfaces TypeScript
```

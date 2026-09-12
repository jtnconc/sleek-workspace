# Reemplazo de iconografía con Tabler Icons

## Objetivo
Sustituir únicamente los íconos solicitados por sus equivalentes exactos de `@tabler/icons-react`, sin alterar textos, comportamiento, tamaños de botones, espaciado ni estilos circundantes.

## Cambios
- Instalar `@tabler/icons-react` si aún no está disponible.
- Cambiar los íconos de las pestañas Notes, Quote y Rates.
- Cambiar los íconos de las acciones Download PDF, Preview, Historial, Duplicar, Eliminar cotización, Ajustes, Bullet y Abrir cotización.
- Cambiar los íconos predeterminados de los encabezados Reminders, Contacts, Task, Information y Notes.
- Mantener las clases de tamaño existentes y establecer `strokeWidth={2}` en los íconos Tabler.

## Detalles técnicos
- Usar imports nombrados y directos desde `@tabler/icons-react` solamente en los archivos donde se renderiza cada ícono.
- Conservar los íconos no incluidos en el mapeo y toda la estructura visual actual.
- Verificar compilación y comprobar visualmente el encabezado, las pestañas y los widgets en la vista actual.

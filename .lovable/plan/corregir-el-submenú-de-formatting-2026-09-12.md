# Corregir el submenú de Formatting

## Cambio
- Montar todos los submenús de `DropdownMenu` dentro de un portal, igual que el menú principal, para que no queden recortados por contenedores con overflow.
- Activar la detección de colisiones con un margen seguro respecto a los cuatro bordes de la ventana.
- Aplicar estas garantías desde el componente compartido, de modo que también cubran futuros submenús anidados.

## Verificación
- Abrir Notes en una ventana estrecha, forzar el menú `>>` y desplegar `Formatting`.
- Confirmar visualmente que el panel cambia de lado cuando hace falta y permanece completamente dentro de la ventana.
- Revisar errores de compilación y ejecución.

## Detalles técnicos
- Envolver `DropdownMenuSubContent` con `DropdownMenuPrimitive.Portal`.
- Establecer valores predeterminados para `avoidCollisions` y `collisionPadding`, conservando la posibilidad de sobreescribirlos por uso.

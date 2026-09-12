# Toolbar con overflow dinámico

## Objetivo
Eliminar el scroll horizontal del encabezado y mantener siempre visible el selector Notes/Quote/Rates.

## Cambios
- Observar con `ResizeObserver` el ancho disponible en la zona izquierda del encabezado y recalcularlo también al abrir o cerrar la búsqueda.
- Reservar primero el espacio del `ToolSwitcher`; usar el espacio restante para las acciones de Notes o Quote.
- Mostrar las acciones en orden y mover las últimas que ya no entren a un menú `ChevronsRight`.
- Mantener en el menú los mismos íconos, estados activos, estados deshabilitados y acciones que en la barra visible.
- Conservar las opciones completas de formato de Notes cuando “Formatting” pase al menú.
- Animar suavemente la entrada y salida de acciones y del botón de overflow, respetando reducción de movimiento.

## Verificación
- Probar Notes y Quote con la búsqueda cerrada y expandida.
- Probar anchos de escritorio y móvil típicos, confirmando que no aparezca scroll horizontal y que el `ToolSwitcher` permanezca visible.
- Ejecutar las comprobaciones existentes y revisar errores de ejecución.

## Detalles técnicos
- `WorkspaceHeader` calculará cuántas acciones caben usando los anchos reales del contenedor y del selector.
- `NotesToolbar` y `QuoteToolbar` recibirán el límite visible y renderizarán el resto mediante el menú desplegable existente del proyecto.

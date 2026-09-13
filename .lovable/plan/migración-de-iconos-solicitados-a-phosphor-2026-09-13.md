# Migración de iconos solicitados a Phosphor

## Objetivo
Reemplazar únicamente los iconos enumerados por sus equivalentes de `@phosphor-icons/react`, conservando tamaños visuales, color y comportamiento actuales.

## Cambios
- Instalar `@phosphor-icons/react`.
- Actualizar los iconos indicados en ToolSwitcher, QuoteToolbar, el panel de Historial de QuoteTool, WidgetContent, SettingsPanel, NotesToolbar, WorkspaceHeader y el catálogo de iconos de widgets.
- Usar `size` numérico en cada icono Phosphor y mantener `currentColor`; no establecer `weight` para conservar el valor `regular` predeterminado.
- Sustituir también el icono de overflow donde realmente se renderiza actualmente en los toolbars, sin mover controles ni cambiar su lógica.
- Eliminar `@heroicons/react` si ya no queda ningún uso. Mantener `lucide-react` porque otros controles todavía lo utilizan, y retirar `@tabler/icons-react` solo si estuviera instalado y sin uso.

## Verificación
- Confirmar que no queden imports de Heroicons ni referencias obsoletas en los archivos modificados.
- Comprobar que la compilación termine sin errores.
- Revisar visualmente el selector de herramientas, los toolbars, Ajustes, Historial y los iconos de widgets en la vista previa.

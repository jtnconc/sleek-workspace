# Adaptar los widgets minimizados al ancho disponible

## Cambio
- Medir continuamente el ancho real de la fila y el ancho necesario para mostrar todos los widgets con ícono y título.
- Mantener las pills actuales cuando todas quepan sin desplazamiento horizontal.
- Cambiar automáticamente a círculos del mismo tamaño, con íconos centrados y distribución uniforme, cuando el espacio sea menor.
- Dar prioridad a Reminders, Contacts, Information, Tasks y Notes; mostrar widgets adicionales solo en los espacios restantes y ocultarlos temporalmente cuando no quepan.
- Animar suavemente el cambio de tamaño, texto y aparición de widgets adicionales.

## Verificación
- Probar varios anchos de ventana y confirmar que el modo cambia en ambos sentidos.
- Confirmar que los cinco widgets base permanecen visibles y que nunca aparece scroll horizontal.
- Revisar visualmente la alineación, las alertas y los indicadores existentes.
- Comprobar compilación y errores de ejecución.

## Detalles técnicos
- Usar `ResizeObserver` sobre la fila minimizada y una fila invisible de medición para calcular el ancho completo sin estimaciones por título.
- Calcular la capacidad del modo circular con tamaños y separaciones estables.
- Conservar el orden relativo actual dentro de los grupos base y adicional.

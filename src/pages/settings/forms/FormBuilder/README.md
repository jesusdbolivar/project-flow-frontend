# Form Builder

Constructor visual de formularios con drag & drop usando Shadcn/UI y @dnd-kit.

## 📁 Estructura

```
FormBuilder/
├── index.tsx              # Componente principal con lógica de DnD
├── types.ts              # Definiciones de tipos y esquemas
├── DraggableField.tsx    # Campo individual arrastrable
├── FormBuilderCanvas.tsx # Canvas donde se sueltan los campos
├── FormBuilderSidebar.tsx # Paleta de componentes disponibles
├── FieldEditor.tsx       # Panel de edición de propiedades
├── FormPreview.tsx       # Vista previa en tiempo real
└── README.md            # Esta documentación
```

## 🎯 Características

- ✅ Drag & Drop desde la paleta de componentes
- ✅ Reordenamiento de campos con sortable
- ✅ Edición de propiedades (label, placeholder, validaciones)
- ✅ Vista previa en tiempo real
- ✅ Exportación a JSON Schema
- ✅ 9 tipos de campos soportados

## 🧩 Tipos de Campos

| Tipo | Icono | Descripción |
|------|-------|-------------|
| `text` | Type | Campo de texto simple |
| `email` | Mail | Validación de email |
| `number` | Hash | Números únicamente |
| `textarea` | AlignLeft | Texto multilínea |
| `select` | List | Menú desplegable |
| `checkbox` | CheckSquare | Casilla de verificación |
| `radio` | Circle | Grupo de opciones |
| `date` | Calendar | Selector de fecha |
| `switch` | ToggleLeft | Interruptor on/off |

## 📦 Uso

```tsx
import { FormBuilder } from './FormBuilder';
import { useState } from 'react';
import type { FormField } from './FormBuilder/types';

function MyPage() {
  const [fields, setFields] = useState<FormField[]>([]);

  return (
    <FormBuilder 
      initialFields={fields} 
      onChange={setFields} 
    />
  );
}
```

## 🔧 Propiedades de FormBuilder

```typescript
interface FormBuilderProps {
  initialFields?: FormField[];  // Campos iniciales (opcional)
  onChange?: (fields: FormField[]) => void; // Callback al cambiar
}
```

## 📋 Esquema JSON

El Form Builder genera un esquema JSON con esta estructura:

```json
{
  "title": "Mi Formulario",
  "description": "Descripción opcional",
  "fields": [
    {
      "id": "uuid-v4",
      "type": "text",
      "label": "Nombre completo",
      "placeholder": "Ingresa tu nombre",
      "required": true,
      "description": "Tu nombre como aparece en tu ID",
      "validation": {
        "minLength": 3,
        "maxLength": 50
      }
    },
    {
      "id": "uuid-v4",
      "type": "select",
      "label": "País",
      "options": [
        { "label": "México", "value": "mx" },
        { "label": "Colombia", "value": "co" }
      ],
      "required": true
    }
  ]
}
```

## 🎨 Integración con Shadcn

Todos los componentes usan Shadcn/UI:
- Button
- Card
- Input
- Label
- Select
- Checkbox
- Radio
- Switch
- Sheet (para FieldEditor)
- Tabs (en FormEditPage)

## 🔄 Flujo de Trabajo

1. **Arrastrar** - Toma un componente de la paleta lateral
2. **Soltar** - Suéltalo en el canvas central
3. **Editar** - Haz clic en el ícono de configuración
4. **Reordenar** - Arrastra los campos para cambiar el orden
5. **Eliminar** - Usa el ícono de papelera
6. **Previsualizar** - Cambia a la pestaña "Vista Previa"
7. **Guardar** - Exporta el JSON Schema

## 🚀 Próximas Mejoras

- [ ] Validaciones avanzadas (regex, custom)
- [ ] Campos condicionales (show/hide)
- [ ] Plantillas predefinidas
- [ ] Importar desde JSON
- [ ] Duplicar campos
- [ ] Undo/Redo
- [ ] Temas personalizados

## 🐛 Troubleshooting

### Los campos no se arrastran
- Verifica que `@dnd-kit/core` esté instalado
- Asegúrate de tener `DndContext` envolviendo todo

### Los estilos no se aplican
- Confirma que Tailwind esté configurado
- Verifica que los componentes Shadcn estén instalados

### TypeScript errors
- Usa `import type` para tipos
- Asegúrate de tener `verbatimModuleSyntax` habilitado

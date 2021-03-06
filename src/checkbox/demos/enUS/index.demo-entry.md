# Checkbox

Yo, yo, check it out.

## Demos

```demo
basic
group
grid
indeterminate
controlled
event
```

## Props

### Checkbox Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| checked | `boolean` | `undefined` |  |
| default-checked | `boolean` | `false` |  |
| disabled | `boolean` | `false` |  |
| focusable | `boolean` | `true` |  |
| label | `string \| (() => VNodeChild)` | `undefined` |  |
| value | `string \| number` | `undefined` |  |
| on-update:checked | `(checked: boolean) => void` | `undefined` |  |

### Checkbox Group Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| disabled | `boolean` | `false` |  |
| default-value | `Array<string \| number>` | `null` | `null` |
| value | `Array<string \| number> \| null` | `undefined` |
| on-update:value | `(value: string \| number)` | `undefined` |  |

## Slots

### Checkbox Slots

| Name    | Parameters | Description |
| ------- | ---------- | ----------- |
| default | `()`       |             |

### Checkbox Group Slots

| Name    | Parameters | Description |
| ------- | ---------- | ----------- |
| default | `()`       |             |

# Consulta de precios VOLF

App para la Galaxy Tab A11: el cliente pasa el código de barras por la pistola y ve el producto con su precio. Los precios salen de un Excel.

## 1. Publicarla (una sola vez)

La app necesita estar en una dirección https para instalarse en la tablet. Con GitHub Pages es gratis:

1. Entrá a github.com (creá una cuenta si no hay) y tocá **New repository**. Nombre: `volf-precios`, tipo **Public**, **Create repository**.
2. Tocá **uploading an existing file**, seleccioná todos los archivos de esta carpeta (incluido `precios.xlsx`) y arrastralos a la página. **Commit changes**.
3. **Settings → Pages → Branch: main / (root) → Save**. En un minuto queda en `https://TU-USUARIO.github.io/volf-precios/`.

## 2. Instalarla en la tablet

1. Abrí esa dirección en Chrome.
2. Menú ⋮ → **Agregar a la pantalla principal** → **Instalar**.
3. Abrila desde el ícono **VOLF Precios**: arranca a pantalla completa y funciona aunque se corte internet.

## 3. La pistola

- **Bluetooth**: emparejala en Ajustes → Conexiones → Bluetooth, en modo teclado (HID), que es el normal.
- **USB**: con un adaptador OTG USB-C. Ojo: la tablet tiene un solo puerto, así que para que cargue al mismo tiempo necesitás un hub USB-C con carga (PD). Por eso conviene la Bluetooth.
- Idealmente configurada para mandar **Enter** al final de cada lectura. Si no lo manda, la app igual funciona.
- Lee EAN con o sin el 0 inicial, códigos VOLF (`RP 0205`, `RP0205` o `volf_RP0205-Unico-U`), QR con link y QR GS1.

## 4. Actualizar precios

La lista del local es la de Odoo **Belgrano**, con precios **sin IVA**. La app le suma el 21 % (redondeado por línea, igual que Odoo, así el precio de la tablet coincide con el que se cobra) y muestra abajo, más chico, el **PRECIO SIN IMPUESTOS NACIONALES**, como pide la Resolución 4/2025 para exhibir precios a consumidor final.

- **Automático**: en Odoo exportá la lista Belgrano con las columnas *Reglas de lista de precios/Producto*, */Precio fijo*, */Producto/Referencia interna* y */Producto/Código de barras* (guardá esa exportación como plantilla en Odoo para repetirla en dos clics). Renombrá el archivo a `precios.xlsx` y subilo a GitHub con **Add file → Upload files** reemplazando el anterior. La tablet lo toma sola (cada 30 minutos por defecto) o al instante desde el panel con **Buscar actualización ahora**.
- **A mano**: panel → **Cargar Excel** → elegís el archivo (Descargas, Drive o pendrive). Antes de cargarlo te muestra cuántos productos encontró y qué columnas usó.
- Una carga a mano queda hasta que aparezca un `precios.xlsx` distinto en el servidor.

## 5. El Excel

Sirve el export de Odoo tal cual o la `PLANTILLA_precios.xlsx`. Hace falta una columna de **código de barras** o de **código**, y una de **precio**. Opcionales: descripción, marca, presentación, precio anterior (se muestra tachado con el % de descuento) e imagen (link a la foto).

Lee títulos arriba de los encabezados y varias hojas (las combina). Nunca toma columnas de costo. Los productos sin código de barras se encuentran igual buscando su código a mano en el panel.

Si algún día cargás una lista con IVA incluido, en el panel cambiá **El precio del Excel es** a **Final**.

## 6. Panel

Mantené apretado el logo 2 segundos. **PIN inicial: 1234** (cambialo en el mismo panel).

Desde ahí: cargar la lista, ver cuándo se actualizó y qué avisos tuvo (productos sin precio, códigos repetidos, EAN rotos), IVA, texto debajo del precio, tiempo en pantalla, buscar un producto a mano y cambiar el PIN.

## 7. Dejarla como kiosco

- **Que no se pueda salir de la app**: en Ajustes buscá **Fijar aplicaciones** y activalo. Después abrí la vista de apps recientes, tocá el ícono de VOLF Precios y elegí **Fijar**.
- **Batería**: va a estar siempre enchufada, así que en Ajustes buscá **Proteger batería** y activalo.
- **Pantalla**: la app la mantiene encendida sola mientras está abierta.
- **Teclado en el panel**: con la pistola conectada Android puede esconder el teclado en pantalla. En Ajustes buscá **Teclado físico** y activá **Mostrar teclado en pantalla**.

## 8. Privacidad

El repositorio es público: cualquiera con el link puede bajar `precios.xlsx`. La lista Belgrano tiene solo lo que ve el cliente (código, EAN, descripción, precio); nunca subas costos. Si preferís que la lista no esté en internet, no subas `precios.xlsx`, dejá vacía la **Dirección del Excel** en el panel y cargala siempre a mano.

## 9. Problemas comunes

- **Escaneo y no pasa nada**: la pistola no está conectada o no está en modo teclado. Probala escribiendo en cualquier app de notas: si aparecen los números, está bien.
- **"No encontramos este producto"**: ese código no está en la lista. Buscalo a mano en el panel y revisá el EAN en el Excel.
- **Letras cambiadas al leer QR con texto**: poné el teclado físico de la tablet en Inglés (EE. UU.) o configurá la pistola con esa distribución. Los números no se ven afectados.
- **No se actualiza sola**: en el panel, "Actualización automática" dice cuándo fue la última revisión y qué pasó.

## Para quien mantenga la app

- Probarla en la PC: abrí `index.html` con Chrome, mantené apretado el logo, cargá un Excel y tipeá un EAN + Enter.
- Si cambiás archivos de la app, subí el número de `VERSION` en `sw.js` (por ejemplo `volf-precios-1.0.4`) para que la tablet los renueve.
- Tipografías Bodoni Moda y Questrial (licencia OFL) y lector de Excel SheetJS (Apache 2.0), incluidos en la carpeta para funcionar sin internet.

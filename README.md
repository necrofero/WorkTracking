# WorkTracking

El proyecto está realizado utiliznado Angular.

Para la instalación del framework y de sus dependencias, es necdsario tener instalado [Node.js](https://nodejs.org/es/) y ejecitar el comando:

`nmp install`

Una vez instalado, se puede arrancar el servidor de desarrollo con el comando:

`ng serve`

y navegando a `thhp://localhost:4200`.

Se puede generar la versión para producción con el comando:

`ng build --prod`

## Configuración

En el servicio `ConfigService` se encuentra la única variable de configuración:

* `END_POINT`: Endpoint de la API del servidor.
# 햇갈려서 적는 Import 사용법
## 코드 스타일
한개의 변수 / 함수를 export 할때는 export default 사용   
여러개의 변수나 함수를 export 할때는 다중 export 사용
## Logger
```js
import Logger from '#logger';
```
## Database
DB Instance
```js
import { MySQL, MongoDB } from '#database';
```
MongoDB Schemas
```js
import { StatusCodes, ErrorCodes } from '#schemas';
```

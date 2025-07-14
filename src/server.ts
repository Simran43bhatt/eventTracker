import App from '@app';
import EventRoute from '@routes/event.route';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new EventRoute()]);

app.listen();

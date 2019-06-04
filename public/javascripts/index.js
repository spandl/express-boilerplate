import { hello } from './module';

// CSS
import '../stylesheets/style.styl';

const a = () => {
    console.log('arrow function');
};

console.log('index');

hello();
a();
// COmmswwjjmmjjleew222233333

if (module.hot) {
    module.hot.accept('./module.js', () => {
        console.log('Accepting the updated printMe module!');
        hello();
    });
    module.hot.accept('../../views/index.pug', () => {
        console.log('Accepting pug module!');
        hello();
    });
}

import { Novel } from './src/projects';

const novel: Novel = new Novel();

novel.setTitle('La Caravana Pasa');

const id1 = novel.addChapter('Chapter 1');
const id2 = novel.addChapter('Chapter 2');
const id3 = novel.addChapter('Chapter 3');
const id4 = novel.addChapter('Chapter 4');

novel.addScene(id4, 'Contenido escena 1');
novel.addScene(id4, 'Contenido escena 2');
novel.addScene(id4, 'Contenido escena 3');

console.log(novel);

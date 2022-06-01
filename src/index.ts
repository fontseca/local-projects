import { Novel } from './projects';

try {
  const novel: Novel = new Novel({
    title: 'The New Novel',
    path: './files',
  });

  novel.addChapter('ch1');
} catch (err) {
  console.error(err);
}

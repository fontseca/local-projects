import { Novel } from './projects';

try {
  const novel: Novel = new Novel({
    title: 'The New Novel',
    path: './files',
  });

  console.log(novel);
} catch (err) {
  console.error(err);
}

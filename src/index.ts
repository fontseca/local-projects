import { Novel } from './projects';

try {
  const novel: Novel = new Novel();
  novel.setTitle('Novel');

  console.log(novel);
} catch (err) {
  console.error(err);
}

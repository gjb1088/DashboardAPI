import adapter from '@sveltejs/adapter-static';
export default {
  kit: {
    adapter: adapter({ 
      // default options — outputs into `build`
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    paths: { // if you’re serving from root
      base: '',
      assets: ''
    }
  }
};

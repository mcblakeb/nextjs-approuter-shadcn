'use server';

import { v2 } from '@google-cloud/translate';

const translateClient = new v2.Translate({
  projectId: 'api-project-538459001331',
  key: 'AIzaSyCoGTTWEXPXBBqbhjQxmLHOnIRcpeyf9Uw',
});

const translateText = async (word: string): Promise<any> => {
  const res = await translateClient.translate(word, { from: 'es', to: 'en' });
  return res[0];
};

export { translateText };

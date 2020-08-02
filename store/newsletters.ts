import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import firestore from '~/plugins/firestore'

@Module({ stateFactory: true, name: 'newsletters', namespaced: true })
export default class newslettersModule extends VuexModule {
    @Action({ rawError: true })
    public async GetNewsletters() {
      try {
        const query = await firestore.collection('newsletters').get();
        return query.docs.map(doc => doc.data());
      } catch (error) {
        console.log({ error })
      }
      return;
    }
}
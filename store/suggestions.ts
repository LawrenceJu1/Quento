import {
  Module,
  VuexModule,
  MutationAction,
  Action,
  Mutation
} from 'vuex-module-decorators'
import firestore from '~/plugins/firestore'
import type { firestore as store } from 'firebase'
import { firestore as YEE } from 'firebase/app'
import { authStore } from './index'

import { Suggestion, Suggestion_t_F } from '~/types/suggestions'
import firebase from '~/plugins/firebase'
type QueryType = store.Query<store.DocumentData>

@Module({ stateFactory: true, name: 'suggestions', namespaced: true })
export default class SuggestionsModule extends VuexModule {
  field: keyof Suggestion = 'createdAt'
  pageSize = 15
  currentPageSize = 15
  sortOrder: 'asc' | 'desc' = 'desc';
  likedSuggestions: string[] = []
  suggestions: Suggestion[] = []

  get NewQuery() {
    return firestore
      .collection('suggestions')
      .orderBy(this.field)
      .limit(this.pageSize)
  }

  @Action({ rawError: true })
  public async GetSuggestions() {
    try {
      const query = firestore
        .collection('suggestions')
        .orderBy(this.field, this.sortOrder)
        .limit(this.currentPageSize)
      const a = await query.get()
      const suggestions = a.docs.map(
        (value) => new Suggestion({ ...value.data(), id: value.id } as any)
      )
      this.SET_SUGGESTIONS({ suggestions })
    } catch (error) {
      console.log({ error })
    }
    return;
  }
  @Mutation
  private SET_SUGGESTIONS({ suggestions }: { suggestions: Suggestion[] }) {
    this.suggestions = suggestions
  }

  @Mutation
  private SET_PAGE_SIZE(size: number) {
    this.currentPageSize = size
  }

  @Mutation
  private SET_LIKED_SUGGESTIONS(likedSuggestions: string[]) {
    this.likedSuggestions = likedSuggestions
  }

  @Mutation
  private TOGGLE_LIKED_SUGGESTION(suggestionId: string) {
    var index = this.likedSuggestions.indexOf(suggestionId)
    const suggestionIndex = this.suggestions.findIndex((doc) => doc.id! == suggestionId)!;
    if (index === -1) {
      this.likedSuggestions.push(suggestionId)
      this.suggestions[suggestionIndex].upVotes++;
    } else {
      this.likedSuggestions.splice(index, 1);
      this.suggestions[suggestionIndex].upVotes != 0 ? this.suggestions[suggestionIndex].upVotes-- : '';
    }
  }
  @Action({ rawError: true })
  public async ToggleLikedSuggestion(id: string) {
    if (this.likedSuggestions.includes(id)) {
      const updateUser = firestore
        .collection('users')
        .doc(authStore.CurrentUser?.uid)
        .update({
          likedSuggestions: YEE.FieldValue.arrayRemove(id)
        })
      const updateSuggestion = firestore.collection('suggestions').doc(id).update({
        'upVotes': YEE.FieldValue.increment(-1),
      })
      await Promise.all([updateUser, updateSuggestion]);

    } else {
      const updateUser = firestore
        .collection('users')
        .doc(authStore.CurrentUser?.uid)
        .update({
          likedSuggestions: YEE.FieldValue.arrayUnion(id)
        })
      const updateSuggestion = firestore.collection('suggestions').doc(id).update({
        'upVotes': YEE.FieldValue.increment(1),
      })
      await Promise.all([updateUser, updateSuggestion]);
    }
    this.TOGGLE_LIKED_SUGGESTION(id);
    return;
  }
  @Mutation
  private SET_SORT_BY({ field, order }: { field: "createdAt" | "upVotes", order: 'asc' | 'desc', }) {
    this.field = field;
    this.sortOrder = order;
    this.currentPageSize = this.pageSize;
  }
  @Action({ rawError: true })
  public async SetSortBy(sortBy: "createdAt" | "upVotes") {
    if (this.field == sortBy || !sortBy) return;
    switch (sortBy) {
      case "createdAt":
        this.SET_SORT_BY({ field: sortBy, order: 'desc' })
        break;
      case "upVotes":
        this.SET_SORT_BY({ field: sortBy, order: 'desc' })
        break;
    }

    return await this.GetSuggestions();
  }
  @Action({ rawError: true })
  public async GetLikedSuggestions() {
    console.log({ user: authStore.user })
    const userId = authStore.user?.uid
    console.log({ userId })
    if (!userId) return
    const user = await firestore.collection('users').doc(userId).get()

    const userData = user.data()
    console.log({ userData })
    const likedSuggestions = user.data()?.likedSuggestions

    console.log({ likedSuggestions })
    if (likedSuggestions) {
      this.SET_LIKED_SUGGESTIONS(likedSuggestions)
    }
  }

  @Action({ rawError: true })
  public async GetNextPage() {
    try {
      if (this.currentPageSize > this.suggestions.length) {
        return
      }
      console.log('GETTING MORE BOIS')

      const numberDocsToGet = this.currentPageSize + this.pageSize
      this.SET_PAGE_SIZE(numberDocsToGet)
      this.GetSuggestions()
    } catch (error) {
      console.log({ error })
    }
  }

  @Action({ rawError: true })
  public async PostSuggestion({
    title,
    contents
  }: {
    title: string
    contents: string
  }) {
    const createdAt = new Date()
    const { uid, displayName } = authStore.user!

    const docData = new Suggestion({
      title,
      contents,
      createdAt,
      upVotes: 0,
      userDisplayName: displayName!,
      uid
    })
    const docRef = await firestore
      .collection('suggestions')
      .add(docData.toFirebase())
  }
}

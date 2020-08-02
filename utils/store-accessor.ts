import { Store, ModuleTree} from 'vuex'
import { getModule } from "vuex-module-decorators";
import window from "~/store/window";
import navigation from '~/store/navigation';
import auth from '~/store/auth';
import suggestions from '~/store/suggestions'
import newsletters from '~/store/newsletters'

let windowStore : window;
let navigationStore : navigation;
let authStore : auth;
let newslettersStore : newsletters;
let suggestionsStore : suggestions;

function initialiseStores(store : Store<any>) : void {
    windowStore = getModule(window, store);
    navigationStore = getModule(navigation, store);
    authStore = getModule(auth, store);
    suggestionsStore = getModule(suggestions, store);
    newslettersStore = getModule(newsletters, store);
}

export { initialiseStores, windowStore, navigationStore, authStore, suggestionsStore, newslettersStore }
use ic_cdk::{
    export::{
        candid::{CandidType, Deserialize},
        Principal,
    },
    query, update,
};
use std::cell::RefCell;
use std::collections::BTreeMap;

type IdStore = BTreeMap<String, Principal>;
type HashStore = BTreeMap<Principal, Hash>;

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
struct Hash {
    pub id: String,
}

thread_local! {
    static HASH_STORE: RefCell<HashStore> = RefCell::default();
    static ID_STORE: RefCell<IdStore> = RefCell::default();
}

#[query(name = "getSelf")]
fn get_self() -> Hash {
    let id = ic_cdk::api::caller();
    HASH_STORE.with(|hash_store| {
        hash_store
            .borrow()
            .get(&id)
            .cloned().unwrap_or_default()
    })
}

#[query]
fn get(id: String) -> Hash {
    ID_STORE.with(|id_store| {
        HASH_STORE.with(|hash_store| {
            id_store
                .borrow()
                .get(&id)
                .and_then(|id| hash_store.borrow().get(id).cloned()).unwrap_or_default()
        })
    })
}

#[update]
fn update(hash: Hash) {
    let principal_id = ic_cdk::api::caller();
    ID_STORE.with(|id_store| {
        id_store
            .borrow_mut()
            .insert(hash.id.clone(), principal_id);
    });
    HASH_STORE.with(|hash_store| {
        hash_store.borrow_mut().insert(principal_id, hash);
    });
}
import nock from 'nock';

const version = 17;

export const PLAYER_ID = 158023;

export function mockApi() {
  // Mock API Responses from Fut - ASSUMES XBOX ONE
  const scope = nock('https://utas.external.s3.fut.ea.com:443', { encodedQueryParams: true });
  // credits
  scope.post(`/ut/game/fifa${version}/user/credits`).reply(200, {});
  // tradepile
  scope.post(`/ut/game/fifa${version}/tradepile`).reply(200, {});
  // removeFromTradepile
  scope.post(/trade\/([\d]+)$/).reply(200, {});
  // watchlist
  scope.post(`/ut/game/fifa${version}/watchlist`).reply(200, {});
  // pilesize
  scope.post(`/ut/game/fifa${version}/clientdata/pileSize`).reply(200, {});
  // relist all
  scope.post(`/ut/game/fifa${version}/auctionhouse/relist`).reply(200, {});
  // search transfer market
  scope.post(`/ut/game/fifa${version}/transfermarket`).query(true).twice()
  .reply(
    200,
    // This is the gzip response of a search for "messi"
    ['1f8b0800000000000000ed9b4b8fdb3610c7bf4aa1b30bf0357cf896a04db1409106ddb439143d686d3955ab950c3d9218c17ef70e25d9d95894e160491a71b2a75dda2287e4f0b7ff198e3e26595d57f56d9bb659b22cbba25824ab3a5be76d932cc92249bb559b57e54db9a992e55f1f93b64ed7d9cd3a594a6e88209c08bd48f236bbff296dd364f931c9f1334aa4329a4a602017499bdf674d9bde6ff103a1802aa5045d249baabe4f6ddfc932d908ce9345d2957df7e95d81b66cd2a2c9d080a6c95a3b20054d185f24353e54be4d96860f03bfde6df1dbc9b64877598d9dd4595375f5aa37f247aa95d68650691649f5becc6a9c153eb7ce9b555aafff4c8b0e9f55420c5d8dab604dbb4dd1065c0afc56d3ddb538869d183e5aa44d6b3f7c55e72bfcae9694105ca7fbaab64f2c017fdfe46d9935cd6862f96f57ef4623cbaab4bd0e6dbfa4b82efd226feb6c83db90ad5f554d3e2ec9ef2ff08bb86c6df36bdeb4fddabf1bcc35b68375f6011f7d581c5af9a1953e6a258756e66ce5ce56f1f0374e34df6476ebeca2348fc7a74c392de83dc1ab09e80d79d96f367eb0aaac77ac702934ae40d335dbac6cfab5b26edab6757ed7b5d9f16269f76a19e2b4554ba7b1463aad65f291b99f9a253d34433f8b2cbdb7cec3acd7d729ee7591e294f00febb3b7edaee8fbc2ce8a2c7ddbf58e0bbcf77c9c0c2ebdfcb419cff66d0c1f2faa5d5ab4bbe755d98d7e94f72eb848caf16001ce6238b27bd7c605ccdf591fbceb762fabf77b2f56aaf7e255875e58b6cfadb9f867b5d9f427067f7d9fb6ab7fb2f51e1177f97adfe3e8d3e8aab53d98fdb35ac9a1bfaadce4ebac5c65e351a3b635fbb0cd6bebfa9472864f664591d52ff134606f2f6e5e3cfbe18fd7c9bef967ecf7aec89b7e6cb26fbd19fee867f69b3dd6075c8c7cba6db129f9c4a8c4eecfe7ec628208e964171e696d700a70cc2e61a8a4208ed8c5453c76815776a9e8eca2d27d1ce3c18bb8e105de4d988117ff0eaf7eeccfe1459f042fe6175e965d67c08b51131c5e3da41cf0529a33e38297a2420013d2bace91f0b26a4c1d0b2f0e2c1abc8457786938012f13025e33ba87bad14103d00bb4d302eedd82197829f61d5e94f8849721c42fbcf479f00202c1e1d543ca012f4385246e7849c95078d9ed3a869742acb10b468d7e9557bf4d51e135237ba2092f4eddf0745bc0bca3cb46a757872e8059745107ba94d798511abfe4027d16b924848f197b421d934b29c52897cc492ece39184e389f900be524d5972497f24a2e734a76892790ebcd6ccc48dce410d1d82566e0297d5b30c3ae6f4c757107ba8c57d1c5fd8a2e43e13c744912165d7b441da34b4bcb1243dda97aa6800ac2a71123e51a94bc20baa84f7405d15bb3d4d23349f2788a2b9a0533d4a2d798e9b29e33832d1b9e4c535dcc2bb8c033b884390b5c86c8b0e0da036a1a2d826684b83517e580f20ab89a468b541bad2f082ebfa9ae939a4b878816c1791c69347629f73d018b95a5a7ea0ad925d517458bd344d7d3c24579892c3d63e1c3c501515374294528b8135d5c100da0ec124fc245c5e425cb233c67e9d93cba0681e23d4b3f93688a072fe1a627f35ea23197ea92d708aff9785105cfd2efff037b839711e7c08b0b161c5e03a42601a312868374d74718a3c158704ce0c581191b471ec18bd168f4627e8bbbcc097ad11061e38cf011f12a248c9b9f10abba8b5d63d8782adb050e7c09af61a33617b964149cd0c061e388a949aade30a5c5fee41f692f2185249ce94969aa24f888bd17bdf27c970c012eee3c89f14457a4f1e724d71532eb44aacb192efa2416659eeb220e7516a791050202d745ecd134515c5a28c3ed3f0307b2800057c4b029b228a3821fa7e86356a47a165ce484e00ac3ad99602ddeed229fc975a948ec52e40ae17542705127bdfce28b7ac61725e6ac4cbde6f65a3ca8e41a3935e11701305a38af1895602004eab469a6de68c6d57175444c7ef94d77c1297eb110fc72c3c3cd8e1025a97ca624d5adbcfcd775d98dff96e8e58a166d119dbf4cbd619ea3c573d1a542a36b44d4045db656552967b428915ba06c19fee4652090945cf46520bf2f32c2895c970992eb7aa4b11e1f47ef89a6f95b46e234c0bff69bbb65bcc6b0f10b0bbb2635a94f4a7469cf978ceabcc22efc5181d935326aca2e205411b7ec022990609a4fcae925e3307d093b26bbbee2ca2e3734dce73004b5228d3f172d5e21b24e64ba8803595eaf167d97746975de0b401cc3b8d0c81ad034411627200db85f5f04ce882152e969a60b234f7a49b91531520cc22d7739288bc6ad48e3cf69ad6b2ca23ff1fe8f4b6b71af6122f59da13faf16551016fa567104d4b4a24b4aa3c94c8a9e7109c89a498a4b52a1a9ba24b8be62ad3553cb158d5991c6ffaeb5e2682ddf2f5b9f97d9621883057fdb7a4053623762dd6d8b7c8566dfe011bf590fae7298d0ebea3f742824d7c3c3ffc4d59669fd4b0000'],
    {
      'content-type': 'application/json;charset=utf-8',
      'content-length': '1795',
      'x-unzippedlength': '19453',
      'content-encoding': 'gzip',
      server: 'Jetty(8.0.0.M2)'
    }
  );
  // place bid
  scope.post(/trade\/([\d]+)\/bid$/).reply(200, {});
  // list item
  scope.post(`/ut/game/fifa${version}/auctionhouse`).reply(200, {});
  // trade status
  scope.post(`/ut/game/fifa${version}/trade/status`).query(true).reply(200, {});
  // item
  scope.post(`/ut/game/fifa${version}/item`).reply(200, {});
  // squad list
  scope.post(`/ut/game/fifa${version}/squad/list`).reply(200, {});
  // squad details
  scope.post(/squad\/([\d]+)$/).reply(200, {});
  // sold
  scope.post(`/ut/game/fifa${version}/trade/sold`).reply(200, {});
  // unassigned
  scope.post(`/ut/game/fifa${version}/purchased/items`).reply(200, {});
  return scope;
}

export { mockApi as default };

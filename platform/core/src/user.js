// These should be overridden by the implementation
let user = {
  userLoggedIn: () => false,
  getUserId: () => null,
  getName: () => null,
  getAccessToken: () => "ya29.c.c0AY_VpZgNX6b-XXcJM-bmyqf-NAN4QauFfeCCzanW1miLLzF99wiRfuzR1_gzCgKue98IcGvojhUK7yGuMUzqqLzdsTqCh09eQgXU-T9YTaa73PKpsq3ijTkncAffbUf1C39vumMvJ7NMfD6_K6GRyTVLKiI8uL_zRf0MgkmRssjFDIholAUAvMouhWuFQqyyxWE6TXQMidLJ3oPrk32GNxWyfKarJPZKKSw70lQuqCAyLSGfrDciiEWY5wv1Rlf2tkndcfNacPs0sxn1k5e3G9qKYdX1Q_eHhZTsAANDo49u9MVnnwMX9ZDHr8r6TtohgjDHDkJHGQ9AYJDppMH8Wx3p6tH_KxMjpooR7OXytkVa6OjlPNujdqG3ugcE388PUmrrrsnhbjcuYFSrZ0c9I5eFpkRjSWcevxUuX0b4gY_vkV6M5fjy65Yi8fIjVJsaZhR7V_7XW8VcxXiOet69guzYUFBjY4pYlxmv5oQoBafgwkYFhFpuObBzo02c_uitu5uf4cZQU8J7SzS4r9fFVpyQwRdZBI38MO2Xv6a3a1Ornsrs64nz0pOqnWvBzy3_3JtcXVb_S7lM_3798J6bJ8FeBSvMR1gxxS9v-yF0ZFBO51dW_zuM6d0q-_j-k0VjZkYdZtlMajbygzdp1u1z9X0nS8Vw5YMS2maS6JcujrY1U_rsQXuQuk4dZOga_7fQSttM_rswlht5I4bqy-F01m19cwrbuMJSZ8h7gdIOrIvJcJskl0VUOh393ZsiRZz7mynaluW2MzBZZsf8-MwF6FFaX5jbcRUg96Ugnr7hlXV8kdo_XhfdgVaribexrZcnWWrQavtom_rtsoXhwwlJm0xX_1V_fdJy7mV-x1Uaqj3MOFZIpb_gFW95YanI9pkXYormVz4nw9pvs-S2evy6rmlWI7vOuvezfbvjwZt4soJy62jy5OfFqlmUv5iqU-9dgbwMvjBSj4zdwIimd2MvSpMn7qm17zkIjUfeg53RS2fvs_WSSev8nk1",
  login: () => new Promise((resolve, reject) => reject()),
  logout: () => new Promise((resolve, reject) => reject()),
  getData: key => null,
  setData: (key, value) => null,
};

export default user;

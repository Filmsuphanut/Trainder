<template>
  <div class="black vdoScreen">
    <div
      class="d-flex flex-row flex-wrap justify-center align-center vdoScreen"
      id="vdoList"
    >
      <video
        class="rounded-xl"
        width="auto"
        height="320"
        id="myVdo"
        playsinline
        autoplay
        muted
      ></video>
    </div>
  </div>
</template>

<style>
.vdoIcon {
  margin: 4px;
  padding: 12px;
  border-width: medium !important;
}
.vdoScreen {
  height: calc(100vh - 80px);
  max-height: calc(100vh - 80px);
}
video {
  width: auto;
  max-height: 100%;
  border: 2px solid white;
}
</style>

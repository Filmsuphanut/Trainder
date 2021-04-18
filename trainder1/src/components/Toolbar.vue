<template>
    <v-toolbar>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title class="d-flex align-center">
          <v-img
          alt="Trainder Logo"
          class="shrink mr-2"
          contain
          src="../images/Logo.png"
          transition="scale-transition"
          width="40"
        />
        <span>Trainder</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-message</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-avatar>
            <v-img src="../images/hello.png"></v-img>
        </v-avatar>
      </v-btn>
    </v-toolbar>
</template>
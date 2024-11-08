<template>
  <v-container>
      <v-row>
          <v-col cols="12">
              <v-sheet class="pa-4" elevation="1">
                  <h3 class="text-h5 mb-4">{{ resx.FormTitle }}</h3>
                  <p class="text-subtitle-1 mb-4">
                      <strong>{{ resx.CurrentSetting }}</strong> {{ portalSetting }}
                  </p>

                  <v-text-field v-model="newSetting" :label="resx.InputPlaceHolder" variant="outlined" dense
                      class="mb-4"></v-text-field>

                  <v-row>
                      <v-col cols="6">
                          <v-btn @click="clearPortalSetting" color="error" block>
                              {{ resx.ClearSetting }}
                          </v-btn>
                      </v-col>
                      <v-col cols="6">
                          <v-btn @click="updatePortalSetting" color="success" block>
                              {{ resx.SaveSetting }}
                          </v-btn>
                      </v-col>
                  </v-row>

                  <v-alert close-label="Close Alert" v-model="showAlert" :type="alertType" class="mt-4"
                      variant="outlined" density="compact" closable close-icon="mdi-close">
                      {{ updateStatus }}
                  </v-alert>
              </v-sheet>
          </v-col>
      </v-row>
  </v-container>
</template>

<script setup>
import { ref, inject } from 'vue';
import { getAsync, saveAsync } from '@/assets/api.js';

const resx = inject("resx");

const portalSetting = ref(null);
const newSetting = ref('');
const updateStatus = ref('');
const showAlert = ref(false);
const alertType = ref('success');

const fetchPortalSetting = async () => {
  try {
      const response = await getAsync('Test/GetPersonaBarTestSetting');
      portalSetting.value = response;
  } catch (error) {
      console.error(error);
  }
};

const updatePortalSetting = async () => {
  if (!newSetting.value) {
      updateStatus.value = resx.InputRequired;
      alertType.value = 'error'; 
      showAlert.value = true;
      return;
  }

  await savePortalSetting(resx.SettingSaveSuccessfully);
};

const savePortalSetting = async (message) =>{
  try {
      const data = { TestSetting: newSetting.value };
      const response = await saveAsync(data, 'Test/SetPersonaBarTestSetting', false);
      if (response) {
          portalSetting.value = newSetting.value;
          updateStatus.value = message;
          alertType.value = 'success'; 
          showAlert.value = true;
          newSetting.value = '';
      }
  } catch (error) {
      console.error(error);
      updateStatus.value = resx.SaveFailed; 
      alertType.value = 'error';
      showAlert.value = true;
  }
};

const clearPortalSetting = async () => {
  portalSetting.value = '';
  newSetting.value = '';
  await savePortalSetting(resx.SettingCleared);
};

fetchPortalSetting();
</script>
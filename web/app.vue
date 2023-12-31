<script lang="ts" setup>
import "@material/web/button/filled-button";
import "@material/web/button/filled-tonal-button";
import "@material/web/button/text-button";
import "@material/web/dialog/dialog";
import "@material/web/fab/fab";
import "@material/web/iconbutton/filled-tonal-icon-button";
import "@material/web/iconbutton/icon-button";
import "@material/web/list/list";
import "@material/web/list/list-item";
import "@material/web/progress/circular-progress";
import "@material/web/switch/switch";
import "@material/web/textfield/outlined-text-field";

const state = useStore();
const { $toast } = useNuxtApp();

const { data: forecastResponse } =
  useNuxtData<Responses["forecast"]>("forecast");

const keys = useMagicKeys();
const shiftS = keys["Shift+S"];
const settings = useSettings();

whenever(shiftS, () => useModal("settings"));

const whenMounted = async () => {
  if (settings.value.homeCity)
    await useGetForecast(
      settings.value.numberOfForecasts,
      settings.value.homeCity,
      settings.value.unit,
    );
  else if (settings.value.features.geolocation) {
    const { isSupported, coords, error } = useGeolocation({
      enableHighAccuracy: true,
    });

    if (isSupported.value) {
      if (error.value) {
        $toast.error("Oops, an error occured (in browser)", {
          description:
            error.value.code === 1
              ? "Denied access to precise location"
              : "Unable to access the device location",
        });

        await useGetIp();
      } else {
        if (
          coords.value.latitude === Infinity ||
          coords.value.longitude === Infinity
        )
          await useGetIp();
        else
          await useGetForecast(
            settings.value.numberOfForecasts,
            {
              latitude: coords.value.latitude,
              longitude: coords.value.longitude,
            },
            settings.value.unit,
          );
      }
    } else await useGetIp();
  } else await useGetIp();

  const { data: currentIp } = useNuxtData<Responses["currentIp"]>("ip");

  if (currentIp.value)
    await useGetForecast(
      settings.value.numberOfForecasts,
      currentIp.value,
      settings.value.unit,
    );
};

onMounted(async () => {
  useSetTheme();

  await whenMounted();

  if (settings.value.features.autoRefresh.enabled)
    useIntervalFn(async () => {
      state.value.hasForecastLoaded = false;
      await refreshNuxtData("forecast");
      state.value.hasForecastLoaded = true;
    }, settings.value.features.autoRefresh.interval);
});

watchEffect(() => {
  if (!forecastResponse.value) useHead({ title: "Loading ..." });
  else useHead({ title: `${forecastResponse.value.metadata.name} - Readings` });
});
</script>

<template>
  <ClientOnly>
    <div v-auto-animate>
      <div
        v-if="!forecastResponse"
        class="flex h-screen flex-col items-center justify-center gap-y-4 will-change-contents"
      >
        <SvgoIconRaw
          class="mx-auto w-20 animate-bounce drop-shadow-lg md:w-24"
          role="img"
          aria-label="App icon"
        />
        <p class="md:text-lg">Loading, hang tight ...</p>
      </div>

      <LazyResultBase
        v-else-if="forecastResponse && state.currentView === 'home'"
        class="flex flex-col md:flex-row"
      />

      <LazyResultStatistics
        v-else-if="forecastResponse && state.currentView === 'statistics'"
        class="flex min-h-screen flex-col justify-between gap-y-10 bg-[--md-sys-color-primary-container] py-10 md:w-3/4 md:justify-around md:py-0"
      />
    </div>
    <ModalBase />

    <!-- Toast -->
    <Toast position="bottom-center" rich-colors />
  </ClientOnly>
</template>

<style>
:root {
  --md-ref-typeface-plain: "Roboto";
}
</style>

#!/bin/sh
set -e

download_with_retry() {
    local url=$1
    local output=$2
    local max_retries=3
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        if wget -q "$url" -O "$output"; then
            return 0
        fi
        retry_count=$((retry_count+1))
        sleep 5
    done
    echo "Failed to download $url after $max_retries attempts"
    return 1
}

# 下载和解压 ASF
download_with_retry \
    "https://github.com/JustArchiNET/ArchiSteamFarm/releases/latest/download/ASF-linux-x64.zip" \
    /build/64.zip || exit 1
7z x /build/64.zip -o/build/asf || exit 1
rm -f /build/64.zip

mkdir -p /build/asf/plugins
plugins=(
  "https://github.com/Citrinate/FreePackages/releases/latest/download/FreePackages.zip"
  "https://github.com/CatPoweredPlugins/ASFAchievementManager/releases/latest/download/ASFAchievementManager.zip"
  "https://github.com/chr233/ASFEnhance/releases/latest/download/ASFEnhance.zip"
)

for url in "${plugins[@]}"; do
  file="/build/$(basename "$url")"
  download_with_retry "$url" "$file" || exit 1
  7z x "$file" -o/build/asf/plugins || exit 1
  rm -f "$file"
done

chmod +x /build/asf/ArchiSteamFarm
FROM ubuntu:22.04 AS builder

ENV TZ=Asia/Shanghai \
    DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends -qq \
    tzdata ca-certificates wget curl gnupg p7zip-full unzip \
    libc6 libgcc-s1 libicu70 libssl3 libstdc++6 zlib1g && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    wget -q https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update && apt-get install -y -qq --no-install-recommends \
    dotnet-sdk-9.0 dotnet-runtime-9.0 && \
    rm -rf /var/lib/apt/lists/* packages-microsoft-prod.deb

WORKDIR /build

RUN --mount=type=secret,id=shz,mode=0444,required=true \
    curl -fsSL "$(cat /run/secrets/shz)" -o /build/run.sh && \
    chmod +x /build/run.sh && \
    /build/run.sh

COPY config.7z ./
RUN --mount=type=secret,id=zzz,mode=0444,required=true \
    mkdir -p /build/asf/config && \
    7z x -y -p"$(cat /run/secrets/zzz)" config.7z -o/build/asf/config

RUN mkdir -p /build/output && \
    cp -r /build/asf /build/output/core

FROM mcr.microsoft.com/dotnet/runtime:9.0 AS runtime

WORKDIR /app

COPY --from=builder /build/output/core/ ./core/

RUN chmod -R 777 /app

ENTRYPOINT ["/app/core/ArchiSteamFarm"]
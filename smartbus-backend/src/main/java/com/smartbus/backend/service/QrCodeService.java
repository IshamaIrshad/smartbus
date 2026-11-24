package com.smartbus.backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class QrCodeService {

    public String generateQrCodeBase64(String text) {

        try {
            int width = 300;
            int height = 300;

            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix bitMatrix =
                    new MultiFormatWriter().encode(
                            text,
                            BarcodeFormat.QR_CODE,
                            width,
                            height,
                            hints
                    );

            byte[] pngBytes = createPngBytes(bitMatrix);

            return Base64.getEncoder()
                    .encodeToString(pngBytes);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to generate QR code",
                    e
            );
        }
    }

    private byte[] createPngBytes(BitMatrix matrix)
            throws Exception {

        int width = matrix.getWidth();
        int height = matrix.getHeight();

        java.awt.image.BufferedImage image =
                new java.awt.image.BufferedImage(
                        width,
                        height,
                        java.awt.image.BufferedImage.TYPE_INT_RGB
                );

        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {

                image.setRGB(
                        x,
                        y,
                        matrix.get(x, y)
                                ? 0xFF000000
                                : 0xFFFFFFFF
                );
            }
        }

        java.io.ByteArrayOutputStream outputStream =
                new java.io.ByteArrayOutputStream();

        javax.imageio.ImageIO.write(
                image,
                "PNG",
                outputStream
        );

        return outputStream.toByteArray();
    }
}
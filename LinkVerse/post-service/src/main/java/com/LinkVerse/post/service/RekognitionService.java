//package com.LinkVerse.post.service;
//
//import com.amazonaws.services.rekognition.AmazonRekognition;
//import com.amazonaws.services.rekognition.AmazonRekognitionClientBuilder;
//import com.amazonaws.services.rekognition.model.*;
//import com.amazonaws.services.s3.model.S3Object;
//import com.amazonaws.services.s3.model.S3ObjectInputStream;
//import com.amazonaws.util.IOUtils;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//import java.nio.ByteBuffer;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//
//@Slf4j
//public class RekognitionService {
//
//    private final AmazonRekognition rekognitionClient;
//
//    public RekognitionService() {
//        this.rekognitionClient = AmazonRekognitionClientBuilder.defaultClient();
//    }
//
//    public boolean isImageSafe(S3Object s3Object) {
//        ByteBuffer imageBytes;
//        try (S3ObjectInputStream inputStream = s3Object.getObjectContent()) {
//            imageBytes = ByteBuffer.wrap(IOUtils.toByteArray(inputStream));
//        } catch (Exception e) {
//            log.error("Failed to read image from S3 object", e);
//            throw new RuntimeException("Failed to read image from S3 object", e);
//        }
//
//        DetectModerationLabelsRequest request = new DetectModerationLabelsRequest()
//                .withImage(new Image().withBytes(imageBytes));
//
//        DetectModerationLabelsResult result = rekognitionClient.detectModerationLabels(request);
//        List<ModerationLabel> labels = result.getModerationLabels();
//
//        for (ModerationLabel label : labels) {
//            if (label.getConfidence() > 75) {
//                log.warn("Detected unsafe content: {} with confidence: {}", label.getName(), label.getConfidence());
//                return false;
//            }
//        }
//        return true;
//    }
//
//    public boolean isVideoSafe(String bucketName, String videoKey) {
//        StartContentModerationRequest request = new StartContentModerationRequest()
//                .withVideo(new Video().withS3Object(new com.amazonaws.services.rekognition.model.S3Object().withBucket(bucketName).withName(videoKey)))
//                .withMinConfidence(75F);
//
//        StartContentModerationResult startResult = rekognitionClient.startContentModeration(request);
//        String jobId = startResult.getJobId();
//
//        GetContentModerationRequest getRequest = new GetContentModerationRequest().withJobId(jobId);
//        GetContentModerationResult getResult;
//
//        do {
//            getResult = rekognitionClient.getContentModeration(getRequest);
//        } while (getResult.getJobStatus().equals("IN_PROGRESS"));
//
//        if (getResult.getJobStatus().equals("SUCCEEDED")) {
//            List<ContentModerationDetection> moderationLabels = getResult.getModerationLabels();
//            for (ContentModerationDetection detection : moderationLabels) {
//                if (detection.getModerationLabel().getConfidence() > 75) {
//                    log.warn("Detected unsafe content in video: {} with confidence: {}", detection.getModerationLabel().getName(), detection.getModerationLabel().getConfidence());
//                    return false;
//                }
//            }
//        } else {
//            log.error("Video moderation job failed with status: {}", getResult.getJobStatus());
//            return false;
//        }
//        return true;
//    }
//}
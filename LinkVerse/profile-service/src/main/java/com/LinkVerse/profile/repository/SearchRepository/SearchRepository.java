package com.LinkVerse.profile.repository.SearchRepository;

import com.LinkVerse.profile.dto.PageResponse;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.entity.UserProfile;
import com.LinkVerse.profile.mapper.UserProfileMapper;
import com.LinkVerse.profile.repository.SearchRepository.criteria.SearchCriteria;
import com.LinkVerse.profile.repository.SearchRepository.criteria.UserSearchCriteriaQueryConsumer;
import com.LinkVerse.profile.repository.SearchRepository.specification.SpecSearchCriteria;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.LinkVerse.profile.enums.AppConst.*;


@Slf4j
@Repository
public class SearchRepository {

    @PersistenceContext
    EntityManager entityManager;
    UserProfileMapper userProfileMapper;

    private static final String LIKE_FORMAT = "%%%s%%";

    //cung cấp các API cho việc tương tác với các Entity

    /**
     * Search user using keyword and
     *
     * @param page
     * @param size
     * @param sortBy
     * @param search
     * @return user list with sorting and paging
     */

    // 1 find user by string
    public Page<UserProfile> getUsersWithSortByColumnAndSearch(int page, int size, String sortBy, String search) {
        // Construct the base query
        StringBuilder sqlQuery = new StringBuilder("SELECT u FROM UserProfile u WHERE 1=1");
        if (StringUtils.hasLength(search)) {
            sqlQuery.append(" AND (LOWER(u.firstName) LIKE LOWER(:search)")
                    .append(" OR LOWER(u.lastName) LIKE LOWER(:search)")
                    .append(" OR LOWER(u.email) LIKE LOWER(:search)")
                    .append(" OR LOWER(u.city) LIKE LOWER(:search)")
                    .append(" OR LOWER(u.phoneNumber) LIKE LOWER(:search)");
        }

        // Add sorting if specified
        if (StringUtils.hasLength(sortBy)) {
            Pattern pattern = Pattern.compile(SORT_BY);
            Matcher matcher = pattern.matcher(sortBy);
            if (matcher.find()) {
                sqlQuery.append(String.format(" ORDER BY u.%s %s", matcher.group(1), matcher.group(3)));
            }
        }

        // Create the query
        Query selectedQuery = entityManager.createQuery(sqlQuery.toString());
        selectedQuery.setFirstResult(page * size);
        selectedQuery.setMaxResults(size);
        if (StringUtils.hasLength(search)) {
            selectedQuery.setParameter("search", String.format("%%%s%%", search));
        }
        List<UserProfile> users = selectedQuery.getResultList();

        // Construct the count query
        StringBuilder sqlCountQuery = new StringBuilder("SELECT COUNT(u) FROM UserProfile u WHERE 1=1");
        if (StringUtils.hasLength(search)) {
            sqlCountQuery.append(" AND (LOWER(u.firstName) LIKE LOWER(?1)")
                    .append(" OR LOWER(u.lastName) LIKE LOWER(?2)")
                    .append(" OR LOWER(u.email) LIKE LOWER(?3)")
                    .append(" OR LOWER(u.city) LIKE LOWER(?4)")
                    .append(" OR LOWER(u.phoneNumber) LIKE LOWER(?5)");
        }

        // Create the count query
        Query selectedCountQuery = entityManager.createQuery(sqlCountQuery.toString());
        if (StringUtils.hasLength(search)) {
            String searchParam = String.format("%%%s%%", search);
            selectedCountQuery.setParameter(1, searchParam);
            selectedCountQuery.setParameter(2, searchParam);
            selectedCountQuery.setParameter(3, searchParam);
            selectedCountQuery.setParameter(4, searchParam);
            selectedCountQuery.setParameter(5, searchParam);
        }
        Long totalElement = (Long) selectedCountQuery.getSingleResult();

        // Create pageable
        Pageable pageable = PageRequest.of(page, size);

        return new PageImpl<>(users, pageable, totalElement);
    }

    // 2 criteria
    public Page<UserProfile> advancedSearchUser(int page, int size, String sortBy, String... search) {
        List<SearchCriteria> criteriaList = new ArrayList<>();
        if (search != null) {
            for (String s : search) {
                Pattern pattern = Pattern.compile(SEARCH_OPERATOR);
                Matcher matcher = pattern.matcher(s);
                if (matcher.find()) {
                    criteriaList.add(new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3)));
                }
            }
        }

        List<UserProfile> users = getUsers(page, size, criteriaList, sortBy);
        Long totalElement = getTotalElement(criteriaList);
        Pageable pageable = PageRequest.of(page, size);

        return new PageImpl<>(users, pageable, totalElement.intValue());
    }

    private List<UserProfile> getUsers(int page, int size, List<SearchCriteria> criteriaList, String sortBy) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<UserProfile> criteriaQuery = criteriaBuilder.createQuery(UserProfile.class);
        Root<UserProfile> root = criteriaQuery.from(UserProfile.class);

        Predicate predicate = criteriaBuilder.conjunction();
        UserSearchCriteriaQueryConsumer consumer = new UserSearchCriteriaQueryConsumer(criteriaBuilder, predicate, root);
        criteriaList.forEach(consumer);
        predicate = consumer.getPredicate();
        criteriaQuery.where(predicate);

        if (StringUtils.hasLength(sortBy)) {
            Pattern pattern = Pattern.compile(SORT_BY);
            Matcher matcher = pattern.matcher(sortBy);
            if (matcher.find()) {
                String columnName = matcher.group(1);
                if (matcher.group(3).equalsIgnoreCase("asc")) {
                    criteriaQuery.orderBy(criteriaBuilder.asc(root.get(columnName)));
                } else {
                    criteriaQuery.orderBy(criteriaBuilder.desc(root.get(columnName)));
                }
            }
        }

        return entityManager.createQuery(criteriaQuery)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();
    }

    private Long getTotalElement(List<SearchCriteria> criteriaList) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> criteriaQuery = criteriaBuilder.createQuery(Long.class);
        Root<UserProfile> root = criteriaQuery.from(UserProfile.class);

        Predicate predicate = criteriaBuilder.conjunction();
        UserSearchCriteriaQueryConsumer consumer = new UserSearchCriteriaQueryConsumer(criteriaBuilder, predicate, root);

        criteriaList.forEach(consumer);
        predicate = consumer.getPredicate();
        criteriaQuery.select(criteriaBuilder.count(root));
        criteriaQuery.where(predicate);

        return entityManager.createQuery(criteriaQuery).getSingleResult();
    }


    public PageResponse<UserProfileResponse> searchUserByCriteria(Pageable pageable, String[] user) {
        log.info("-------------- searchUserByCriteria --------------");

        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<UserProfile> query = builder.createQuery(UserProfile.class);
        Root<UserProfile> userRoot = query.from(UserProfile.class);

        List<Predicate> userPreList = new ArrayList<>();
        Pattern pattern = Pattern.compile(SEARCH_SPEC_OPERATOR);
        for (String u : user) {
            Matcher matcher = pattern.matcher(u);
            if (matcher.find()) {
                SpecSearchCriteria searchCriteria = new SpecSearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3), matcher.group(4), matcher.group(5));
                userPreList.add(toUserPredicate(userRoot, builder, searchCriteria));
            }
        }

        Predicate userPre = builder.or(userPreList.toArray(new Predicate[0]));
        query.where(userPre);

        List<UserProfile> users = entityManager.createQuery(query)
                .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        long count = countUser(user);

        return PageResponse.<UserProfileResponse>builder()
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .total(count)
                .items(users.stream().map(userProfileMapper::toUserProfileReponse).toList())
                .build();
    }

    private Predicate toUserPredicate(Root<UserProfile> root, CriteriaBuilder builder, SpecSearchCriteria criteria) {
        log.info("-------------- toUserPredicate --------------");
        return switch (criteria.getOperation()) {
            case EQUALITY -> builder.equal(root.get(criteria.getKey()), criteria.getValue());
            case NEGATION -> builder.notEqual(root.get(criteria.getKey()), criteria.getValue());
            case GREATER_THAN -> builder.greaterThan(root.get(criteria.getKey()), criteria.getValue().toString());
            case LESS_THAN -> builder.lessThan(root.get(criteria.getKey()), criteria.getValue().toString());
            case LIKE -> builder.like(root.get(criteria.getKey()), "%" + criteria.getValue().toString() + "%");
            case STARTS_WITH -> builder.like(root.get(criteria.getKey()), criteria.getValue() + "%");
            case ENDS_WITH -> builder.like(root.get(criteria.getKey()), "%" + criteria.getValue());
            case CONTAINS -> builder.like(root.get(criteria.getKey()), "%" + criteria.getValue() + "%");
        };
    }

    private long countUser(String[] user) {
        log.info("-------------- countUser --------------");

        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = builder.createQuery(Long.class);
        Root<UserProfile> userRoot = query.from(UserProfile.class);

        List<Predicate> userPreList = new ArrayList<>();
        Pattern pattern = Pattern.compile(SEARCH_SPEC_OPERATOR); //  SEARCH_SPEC_OPERATOR = "(\\w+?)([<:>~!])(.*)(\\p{Punct}?)(\\p{Punct}?)"
        for (String u : user) {
            Matcher matcher = pattern.matcher(u);
            if (matcher.find()) {
                SpecSearchCriteria searchCriteria = new SpecSearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3), matcher.group(4), matcher.group(5));
                userPreList.add(toUserPredicate(userRoot, builder, searchCriteria));
            }
        }

        Predicate userPre = builder.or(userPreList.toArray(new Predicate[0]));
        query.select(builder.count(userRoot));
        query.where(userPre);

        return entityManager.createQuery(query).getSingleResult();
    }

}
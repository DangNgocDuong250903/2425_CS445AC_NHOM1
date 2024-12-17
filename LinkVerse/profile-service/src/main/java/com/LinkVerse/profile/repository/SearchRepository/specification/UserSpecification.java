package com.LinkVerse.profile.repository.SearchRepository.specification;

import com.LinkVerse.profile.entity.UserProfile;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.jpa.domain.Specification;


@Getter
@AllArgsConstructor
public class UserSpecification implements Specification<UserProfile> {

    SpecSearchCriteria criteria;
    // chuyển SpecSearchCriteria -> Predicate

    @Override
    public Predicate toPredicate(Root<UserProfile> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        //convert OPERATION -> query
        return switch (criteria.getOperation()){
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
}

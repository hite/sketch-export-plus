(function(window) {
    var version = "0.0.3", Spec = function(options) {
        return this;
    };

    var jQArtboard = $("#artboard"),
        jQNavbar = $("#navbar").addClass("navoff"),
        jQSidebar = $("#sidebar").addClass("sideoff"),
        jQTabs = $("#tabs").hide(),
        jQArtboardList = $("#artboard_list").hide().empty();

    Spec.prototype.artboardList = function(artboards) {
        if(!artboards) return this;
        var self = this, jQTemplate = $("#artboard-item-template");
        jQArtboard.addClass("m");
        jQArtboardList.show();

        $.each(artboards, function(index, artboard) {
            var p = artboard.width / artboard.height,
                width = (p < 1)? Math.round(44 * p): 44,
                height = (p < 1)? 44: Math.round(44 / p); 

            var jQArtboardItem = self.template(jQTemplate, {
                index: index,
                name: artboard.name,
                width: width + "px",
                height: height + "px",
                base64: artboard.imageBase64
            });

            if (self.data.objectID == artboard.objectID) {
                jQArtboardItem.addClass("current");
            }
            jQArtboardList.append(jQArtboardItem);
        });

        return this;
    };
    Spec.prototype.template = function(template, model) {
        var templateData = template.html();
        templateData = templateData.replace(new RegExp("\\$\\{([^\\}]+)\\}", "gi"), function($0, $1) {
            if ($1 in model) {
                return model[$1];
            } else {
                return $0;
            }
        });
        return $(templateData).data("model", model);
    };

 
    window.Index = Spec;
})(window);